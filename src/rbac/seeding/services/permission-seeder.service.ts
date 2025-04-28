import { ClientSession } from 'mongoose';

import { logger } from '../../../lib/logger';
import { UserPermission } from '../../../models/interfaces/userPermission';
import { userPermissionRepository } from '../../../repositories/userPermissions.repository';
import { PermissionDefinition } from '../interfaces/permission-definition.interface';

export const permissionSeederService = {
  async seedPermissions(
    businessId: string,
    permissions: PermissionDefinition[],
    session?: ClientSession,
  ): Promise<Record<string, UserPermission>> {
    logger.info(
      `Seeding ${permissions.length} permissions for business ${businessId}`,
    );

    const createdPermissions: Record<string, UserPermission> = {};

    for (const permDef of permissions) {
      const {
        resource,
        action,
        subResource,
        description,
        category,
        implications,
      } = permDef;

      const name = subResource
        ? `${resource}:${subResource}:${action}`
        : `${resource}:${action}`;

      const existingPerm = await userPermissionRepository.findOne({
        filter: { businessId, name },
      });

      if (existingPerm) {
        logger.debug(
          `Permission ${name} already exists for business ${businessId}`,
        );

        createdPermissions[name] = existingPerm;
        continue;
      }

      const newPermission = await userPermissionRepository.create({
        data: {
          businessId,
          name,
          resource,
          action,
          subResource,
          description,
          category: category || 'General',
          isSystem: true,
          implications,
        },
        session,
      });

      createdPermissions[name] = newPermission;

      logger.debug(`Created permission ${name} for business ${businessId}`);
    }

    logger.info(`Completed seeding permissions for business ${businessId}`);
    return createdPermissions;
  },
};
