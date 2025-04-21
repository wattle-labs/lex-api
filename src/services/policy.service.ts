import { logger } from '../lib/logger';
import { UserRole } from '../models/interfaces/userRole';
import { UserRoleTemplate } from '../models/interfaces/userRoleTemplate';
import {
  adminRepository,
  userPermissionRepository,
  userRoleRepository,
  userRoleTemplateRepository,
} from '../repositories';

export enum PolicyAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
  APPROVE = 'approve',
  ASSIGN = 'assign',
  INVITE = 'invite',
}

export enum PolicyResource {
  BUSINESS = 'business',
  USER = 'user',
  CONTRACT = 'contract',
  PROJECT = 'project',
  INVITATION = 'invitation',
  PERMISSION = 'permission',
  ROLE = 'role',
}

export interface Permission {
  resource: PolicyResource;
  action: PolicyAction;
}

export const createPermission = (
  resource: PolicyResource | string,
  action: PolicyAction | string,
): string => `${resource}:${action}`;

// Result of a permission check with details about how it was resolved
export interface PermissionCheckResult {
  granted: boolean | undefined;
  source?: string; // Where the permission came from (role template, custom permission, admin status)
  details?: {
    roleId?: string;
    permissionId?: string;
    inherited?: boolean;
    condition?: boolean;
    implied?: boolean;
  };
}

class PolicyService {
  /**
   * Check if a user has a specific permission
   * @param userId User to check permissions for
   * @param permission Permission string in format "resource:action"
   * @param resourceId Optional specific resource ID
   * @param businessId Business context for the permission check
   */
  async hasPermission(
    userId: string,
    permission: string,
    resourceId?: string,
    businessId?: string,
  ): Promise<boolean> {
    try {
      const result = await this.checkPermissionWithDetails(
        userId,
        permission,
        resourceId,
        businessId,
      );

      return result.granted === true;
    } catch (error) {
      logger.error('Error checking permission', {
        userId,
        permission,
        resourceId,
        businessId,
        error,
      });

      return false;
    }
  }

  /**
   * Check if a user has a specific permission with detailed results
   */
  async checkPermissionWithDetails(
    userId: string,
    permission: string,
    resourceId?: string,
    businessId?: string,
  ): Promise<PermissionCheckResult> {
    // First check if user is a system admin
    const isSystemAdmin = await this.isSystemAdmin(userId);

    if (isSystemAdmin) {
      return {
        granted: true,
        source: 'system_admin',
      };
    }

    try {
      // Get user roles - if businessId is specified, get only roles for that business
      const userRoles = businessId
        ? await userRoleRepository.findByUserAndBusiness(userId, businessId)
        : await userRoleRepository.findActiveRolesByUser(userId);

      if (!userRoles.length) {
        return { granted: false };
      }

      // Parse the permission
      const [resource] = permission.split(':');

      // Evaluate all user roles until we find one that grants this permission
      for (const role of userRoles) {
        if (!role.isActive) continue;

        // If resource scoping applies, check if the role applies to this resource
        if (resourceId && !role.scope.isGlobal) {
          // For project-specific roles
          if (
            resource === PolicyResource.PROJECT &&
            !role.scope.projectIds?.includes(resourceId)
          ) {
            continue;
          }

          // Add other resource types as needed
          // For business-specific roles
          if (
            resource === PolicyResource.BUSINESS &&
            role.businessId.toString() !== businessId
          ) {
            continue;
          }
        }

        // First check for custom permission overrides in this role
        const customPermissionResult = this.checkCustomPermission(
          role,
          permission,
          resourceId,
        );

        if (customPermissionResult.granted !== undefined) {
          return customPermissionResult;
        }

        // Then check the role template's permissions
        const roleTemplate = await userRoleTemplateRepository.findById({
          id: role.userRoleTemplateId.toString(),
        });

        if (!roleTemplate) continue;

        // Check if the role has meta permissions
        if (this.checkMetaPermission(roleTemplate, permission)) {
          return {
            granted: true,
            source: 'meta_permission',
            details: {
              roleId: role.id?.toString(),
            },
          };
        }

        // Check base permissions directly assigned to the role
        if (roleTemplate.basePermissions.length) {
          const permissionIds = roleTemplate.basePermissions.map(p =>
            typeof p === 'string' ? p : p.toString(),
          );

          const basePermissions = await userPermissionRepository.find({
            filter: { _id: { $in: permissionIds } },
          });

          // Check if any base permission directly grants the requested permission
          for (const basePermission of basePermissions) {
            if (
              basePermission.name === permission ||
              basePermission.name === `${resource}:*` ||
              basePermission.name === '*:*'
            ) {
              return {
                granted: true,
                source: 'base_permission',
                details: {
                  roleId: role.id?.toString(),
                  permissionId: basePermission.id?.toString(),
                },
              };
            }

            // Check implications
            if (basePermission.implications?.includes(permission)) {
              return {
                granted: true,
                source: 'implied_permission',
                details: {
                  roleId: role.id?.toString(),
                  permissionId: basePermission.id?.toString(),
                  implied: true,
                },
              };
            }
          }
        }

        // Check parent role inheritance if present
        if (roleTemplate.parentRoleId) {
          const inheritedResult = await this.checkInheritedPermission(
            roleTemplate.parentRoleId.toString(),
            permission,
            resourceId,
          );

          if (inheritedResult.granted === true) {
            return {
              ...inheritedResult,
              details: {
                ...inheritedResult.details,
                roleId: role.id?.toString(),
                inherited: true,
              },
            };
          }
        }
      }

      // No role grants this permission
      return { granted: false };
    } catch (error) {
      logger.error('Error checking permission details', {
        userId,
        permission,
        resourceId,
        error,
      });

      return { granted: false };
    }
  }

  /**
   * Check if a custom permission in a role grants access
   */
  private checkCustomPermission(
    role: UserRole,
    permission: string,
    resourceId?: string,
  ): PermissionCheckResult {
    if (!role.customPermissions?.length) {
      return { granted: undefined }; // No custom permissions defined
    }

    for (const customPerm of role.customPermissions) {
      if (customPerm.permission === permission) {
        // If resources are specified, check if this resource is included
        if (resourceId && customPerm.resources?.length) {
          if (!customPerm.resources.includes(resourceId)) {
            return { granted: false };
          }
        }

        // Check conditions if present
        if (
          customPerm.conditions &&
          Object.keys(customPerm.conditions).length
        ) {
          // Placeholder for condition evaluation - would be expanded
          // to handle time-based, attribute-based, or other dynamic conditions
          logger.info('Custom permission conditions found but not evaluated', {
            conditions: customPerm.conditions,
          });
          // In a real implementation, you'd evaluate the conditions
          // return { granted: [result of condition evaluation] };
        }

        return {
          granted: customPerm.granted,
          source: 'custom_permission',
          details: {
            roleId: role.id?.toString(),
          },
        };
      }
    }

    return { granted: undefined }; // No matching custom permission
  }

  /**
   * Check if a meta permission grants this permission
   */
  private checkMetaPermission(
    roleTemplate: UserRoleTemplate,
    permission: string,
  ): boolean {
    if (!roleTemplate.metaPermissions) return false;

    const { canInviteUsers, canCreateProjects, canAssignRoles } =
      roleTemplate.metaPermissions;

    switch (permission) {
      case createPermission(PolicyResource.INVITATION, PolicyAction.CREATE):
        return !!canInviteUsers;
      case createPermission(PolicyResource.PROJECT, PolicyAction.CREATE):
        return !!canCreateProjects;
      case createPermission(PolicyResource.ROLE, PolicyAction.ASSIGN):
        return !!canAssignRoles;
      default:
        return false;
    }
  }

  /**
   * Check if a permission is granted by a parent role
   */
  private async checkInheritedPermission(
    parentRoleTemplateId: string,
    permission: string,
    resourceId?: string,
  ): Promise<PermissionCheckResult> {
    try {
      const parentTemplate = await userRoleTemplateRepository.findById({
        id: parentRoleTemplateId,
      });

      if (!parentTemplate) {
        return { granted: false };
      }

      // Check meta permissions
      if (this.checkMetaPermission(parentTemplate, permission)) {
        return {
          granted: true,
          source: 'inherited_meta_permission',
          details: {
            roleId: parentTemplate.id?.toString(),
          },
        };
      }

      // Check base permissions
      if (parentTemplate.basePermissions.length) {
        const permissionIds = parentTemplate.basePermissions.map(p =>
          typeof p === 'string' ? p : p.toString(),
        );

        const permissions = await userPermissionRepository.find({
          filter: { _id: { $in: permissionIds } },
        });

        for (const basePermission of permissions) {
          const [resource] = permission.split(':');

          if (
            basePermission.name === permission ||
            basePermission.name === `${resource}:*` ||
            basePermission.name === '*:*' ||
            basePermission.implications?.includes(permission)
          ) {
            return {
              granted: true,
              source: 'inherited_permission',
              details: {
                roleId: parentTemplate.id?.toString(),
                permissionId: basePermission.id?.toString(),
              },
            };
          }
        }
      }

      // Recursively check parent's parent if exists
      if (parentTemplate.parentRoleId) {
        return this.checkInheritedPermission(
          parentTemplate.parentRoleId.toString(),
          permission,
          resourceId,
        );
      }

      return { granted: false };
    } catch (error) {
      logger.error('Error checking inherited permission', {
        parentRoleTemplateId,
        permission,
        error,
      });

      return { granted: false };
    }
  }

  /**
   * Check if a user has any of the permissions in the list
   */
  async hasAnyPermission(
    userId: string,
    permissions: string[],
    resourceId?: string,
    businessId?: string,
  ): Promise<boolean> {
    for (const permission of permissions) {
      const hasPermission = await this.hasPermission(
        userId,
        permission,
        resourceId,
        businessId,
      );

      if (hasPermission) return true;
    }

    return false;
  }

  /**
   * Check if a user has all of the permissions in the list
   */
  async hasAllPermissions(
    userId: string,
    permissions: string[],
    resourceId?: string,
    businessId?: string,
  ): Promise<boolean> {
    for (const permission of permissions) {
      const hasPermission = await this.hasPermission(
        userId,
        permission,
        resourceId,
        businessId,
      );

      if (!hasPermission) return false;
    }

    return true;
  }

  /**
   * Check if a user is a business owner
   */
  async isBusinessOwner(userId: string, businessId: string): Promise<boolean> {
    try {
      // Query to find user and check if they are the business owner
      const user = await userRoleRepository.findOne({
        filter: {
          userId,
          businessId,
          'onboarding.isBusinessOwner': true,
        },
      });

      return !!user;
    } catch (error) {
      logger.error('Error checking business owner status', {
        userId,
        businessId,
        error,
      });

      return false;
    }
  }

  /**
   * Check if a user is a system admin
   */
  async isSystemAdmin(userId: string): Promise<boolean> {
    try {
      const admin = await adminRepository.findByUserId(userId);
      return !!admin;
    } catch (error) {
      logger.error('Error checking system admin status', { userId, error });
      return false;
    }
  }
}

export const policyService = new PolicyService();
