import { FilterQuery } from 'mongoose';

import { logger } from '../../lib/logger';
import { UserPermission } from '../../models/interfaces/userPermission';
import { userPermissionRepository } from '../../repositories/userPermissions.repository';
import { userRoleTemplateRepository } from '../../repositories/userRoleTemplates.repository';
import { userRoleRepository } from '../../repositories/userRoles.repository';
import { PermissionAdapter } from '../adapters/permission.adapter';
import { Permission } from '../domain/models/permission';
import { cacheService } from './cache.service';

export interface PermissionContext {
  businessId?: string;
  projectId?: string;
}

export const userAccessService = {
  async hasPermission(
    userId: string,
    permission: Permission,
    context?: PermissionContext,
  ): Promise<boolean> {
    try {
      if (!context?.businessId) {
        throw new Error('BusinessId is required for permission checks');
      }

      const cacheKey = `${userId}:${context.businessId}`;
      const cachedPermissions = cacheService.getUserPermissions(cacheKey);

      if (cachedPermissions) {
        return cachedPermissions.some(p => p.equals(permission));
      }

      const userPermissions = await this.getUserPermissions(
        userId,
        context.businessId,
      );

      const domainPermissions = userPermissions.map(p =>
        PermissionAdapter.toDomain(p),
      );

      cacheService.setUserPermissions(cacheKey, domainPermissions);

      return domainPermissions.some(p => p.equals(permission));
    } catch (error) {
      logger.error('Error checking user permission', {
        error,
        userId,
        permission: permission.toString(),
      });
      return false;
    }
  },

  async getUserPermissions(userId: string, businessId: string) {
    try {
      const userRoles = await userRoleRepository.find({
        filter: { userId, businessId, isActive: true },
      });

      if (!userRoles || userRoles.length === 0) {
        return [];
      }

      const roleTemplateIds = userRoles
        .map(role => role.userRoleTemplateId?.toString())
        .filter(Boolean) as string[];

      if (roleTemplateIds.length === 0) {
        return [];
      }

      const roleTemplates = await userRoleTemplateRepository.find({
        filter: { _id: { $in: roleTemplateIds } },
      });

      const permissionIds = new Set<string>();
      roleTemplates.forEach(template => {
        if (template.basePermissions) {
          template.basePermissions.forEach(permId => {
            permissionIds.add(permId.toString());
          });
        }
      });

      if (permissionIds.size === 0) {
        return [];
      }

      return await userPermissionRepository.find({
        filter: {
          _id: {
            $in: Array.from(permissionIds),
          } as FilterQuery<UserPermission>,
        },
      });
    } catch (error) {
      logger.error('Error getting user permissions', {
        error,
        userId,
        businessId,
      });
      return [];
    }
  },
};
