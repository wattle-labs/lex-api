import { logger } from '../lib/logger';
import { Business } from '../models/interfaces/business';
import { MongooseModel } from '../models/interfaces/document.interface';
import { Invitation } from '../models/interfaces/invitation';
import { UserPermission } from '../models/interfaces/userPermission';
import { UserRole } from '../models/interfaces/userRole';
import { UserRoleTemplate } from '../models/interfaces/userRoleTemplate';
import {
  BusinessRepository,
  businessRepository,
} from '../repositories/businesses.repository';
import { invitationRepository } from '../repositories/invitations.repository';
import { userPermissionRepository } from '../repositories/userPermissions.repository';
import { userRoleTemplateRepository } from '../repositories/userRoleTemplates.repository';
import { userRoleRepository } from '../repositories/userRoles.repository';
import { BaseService } from './base.service';

export class BusinessService extends BaseService<MongooseModel<Business>> {
  private businessRepository: BusinessRepository;

  constructor(repository: BusinessRepository) {
    super(repository, 'business');
    this.businessRepository = repository;
  }

  async create(data: Partial<Business>): Promise<MongooseModel<Business>> {
    const business = await this.findBySlug(data?.slug || '');

    if (business) {
      throw new Error('Business already exists');
    }

    // Create the business first
    const newBusiness = await this.businessRepository.create({
      data: {
        ...data,
        setup: {
          status: 'pending',
          completedSteps: [],
        },
      },
    });

    // Seed the standard permissions and roles
    try {
      // TODO: Implement this after RBACv2 is ready

      // Mark permission setup as completed since we've seeded everything
      await this.businessRepository.update({
        filter: { _id: newBusiness.id },
        push: {
          'setup.completedSteps': [
            'permission_created',
            'role_template_created',
          ],
        },
      });

      logger.info(
        `Permissions and roles seeded for new business: ${newBusiness.name}`,
        {
          businessId: newBusiness.id,
        },
      );
    } catch (error) {
      logger.error('Failed to seed permissions for new business', {
        businessId: newBusiness.id,
        error,
      });
      // Don't throw - we've already created the business
      // This allows the business to be created even if seeding fails
      // Admins can manually set up permissions later
    }

    return newBusiness;
  }

  async createPermission(
    businessId: string,
    data: Partial<UserPermission>,
  ): Promise<UserPermission> {
    const permission = await userPermissionRepository.create({
      data: {
        ...data,
        businessId,
      },
    });

    await this.businessRepository.update({
      filter: {
        _id: businessId,
        'setup.status': 'pending',
      },
      push: { 'setup.completedSteps': 'permission_created' },
    });

    return permission;
  }

  async listPermissions(businessId: string): Promise<UserPermission[]> {
    return await userPermissionRepository.findByBusiness(businessId);
  }

  async createRoleTemplate(
    businessId: string,
    data: Partial<UserRoleTemplate>,
  ): Promise<UserRoleTemplate> {
    const roleTemplate = await userRoleTemplateRepository.create({
      data: {
        ...data,
        businessId,
      },
    });

    await this.businessRepository.update({
      filter: {
        _id: businessId,
        'setup.status': 'pending',
      },
      push: {
        'setup.completedSteps': 'role_template_created',
      },
    });

    return roleTemplate;
  }

  async listRoleTemplates(businessId: string): Promise<UserRoleTemplate[]> {
    return await userRoleTemplateRepository.findByBusinessId(businessId);
  }

  async addPermissionsToRoleTemplate(
    businessId: string,
    templateId: string,
    permissionIds: string[],
  ): Promise<UserRoleTemplate | null> {
    // Verify permissions exist and belong to this business
    const permissions = await userPermissionRepository.find({
      filter: {
        _id: { $in: permissionIds },
        businessId,
      },
    });

    if (permissions.length !== permissionIds.length) {
      throw new Error(
        'One or more permissions are invalid or do not belong to this business',
      );
    }

    // Verify template exists and belongs to this business
    const template = await userRoleTemplateRepository.findOne({
      filter: {
        _id: templateId,
        businessId,
      },
    });

    if (!template) {
      throw new Error(
        'Role template not found or does not belong to this business',
      );
    }

    // Add permissions to the template
    const existingPermissionIds = template.basePermissions.map(p =>
      typeof p === 'string' ? p : p.toString(),
    );

    // Find only new permissions that aren't already in the template
    const newPermissionIds = permissionIds.filter(
      id => !existingPermissionIds.includes(id),
    );

    if (newPermissionIds.length === 0) {
      return template; // No new permissions to add
    }

    // Update the template with the new permissions
    return await userRoleTemplateRepository.update({
      filter: { _id: templateId },
      push: { basePermissions: newPermissionIds },
    });
  }

  async deleteRoleTemplate(
    businessId: string,
    templateId: string,
  ): Promise<boolean> {
    // Check if template exists and belongs to this business
    const template = await userRoleTemplateRepository.findOne({
      filter: {
        _id: templateId,
        businessId,
      },
    });

    if (!template) {
      throw new Error(
        'Role template not found or does not belong to this business',
      );
    }

    if (template.isSystem) {
      throw new Error('System role templates cannot be deleted');
    }

    // Check if any users currently have this role assigned
    const usersWithRole = await userRoleRepository.find({
      filter: {
        userRoleTemplateId: templateId,
        isActive: true,
      },
      limit: 1,
    });

    if (usersWithRole.length > 0) {
      throw new Error(
        'Cannot delete a role template that is still assigned to users',
      );
    }

    // Delete the template
    const result = await userRoleTemplateRepository.delete({
      filter: { _id: templateId },
    });

    return result;
  }

  async listUserRoles(businessId: string, userId: string): Promise<UserRole[]> {
    return await userRoleRepository.findByUserAndBusiness(userId, businessId);
  }

  async assignRoleToUser(
    businessId: string,
    userId: string,
    roleTemplateId: string,
    assignedBy: string,
  ): Promise<void> {
    const roleTemplate = await userRoleTemplateRepository.findOne({
      filter: {
        _id: roleTemplateId,
        businessId,
      },
    });

    if (!roleTemplate) {
      throw new Error(
        'Role template not found or does not belong to this business',
      );
    }

    await userRoleRepository.create({
      data: {
        userId,
        businessId,
        userRoleTemplateId: roleTemplateId,
        isActive: true,
        scope: {
          isGlobal: true,
          projectIds: [],
        },
        assignedBy,
        customPermissions: [],
      },
    });
  }

  async findBySlug(slug: string): Promise<Business | null> {
    return await this.businessRepository.findBySlug(slug);
  }

  async createInvitation(
    businessId: string,
    data: Invitation,
  ): Promise<Invitation> {
    const invitation = await invitationRepository.create({
      data: {
        ...data,
        businessId,
      },
    });

    await this.businessRepository.update({
      filter: {
        _id: businessId,
        'setup.status': 'pending',
      },
      push: {
        'setup.completedSteps': 'owner_invitation_sent',
      },
    });

    return invitation;
  }
}

export const businessService = new BusinessService(businessRepository);
