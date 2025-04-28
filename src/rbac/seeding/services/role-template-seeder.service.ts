import { ClientSession, ObjectId } from 'mongoose';

import { logger } from '../../../lib/logger';
import { UserPermission } from '../../../models/interfaces/userPermission';
import { userPermissionRepository } from '../../../repositories/userPermissions.repository';
import { userRoleTemplateRepository } from '../../../repositories/userRoleTemplates.repository';
import { RoleTemplateDefinition } from '../interfaces/role-template-definition.interface';

export const roleTemplateSeederService = {
  async seedRoleTemplates(
    businessId: string,
    roleTemplates: RoleTemplateDefinition[],
    createdPermissions: Record<string, UserPermission>,
    session?: ClientSession,
  ): Promise<void> {
    logger.info(
      `Seeding ${roleTemplates.length} role templates for business ${businessId}`,
    );

    for (const templateDef of roleTemplates) {
      const {
        name,
        description,
        permissions,
        isSystem,
        hierarchy,
        parentRoleName,
      } = templateDef;

      const existingTemplate = await userRoleTemplateRepository.findOne({
        filter: { businessId, name },
      });

      if (existingTemplate) {
        logger.debug(
          `Role template ${name} already exists for business ${businessId}`,
        );
        continue;
      }

      let parentRoleId;
      if (parentRoleName) {
        const parentRole = await userRoleTemplateRepository.findOne({
          filter: { businessId, name: parentRoleName },
        });

        if (parentRole) {
          parentRoleId = parentRole._id;
        } else {
          logger.warn(
            `Parent role "${parentRoleName}" not found for business ${businessId}`,
          );
        }
      }

      const permissionIds: Array<string | ObjectId> = [];
      for (const permDef of permissions) {
        const permName = permDef.subResource
          ? `${permDef.resource}:${permDef.subResource}:${permDef.action}`
          : `${permDef.resource}:${permDef.action}`;

        const permission = createdPermissions[permName];

        if (permission) {
          const permId = permission.id?.toString();
          if (permId) {
            permissionIds.push(permId);
          }
        } else {
          const dbPermission = await userPermissionRepository.findOne({
            filter: { businessId, name: permName },
          });

          if (dbPermission) {
            const permId = dbPermission.id?.toString();
            if (permId) {
              permissionIds.push(permId);
            }
          } else {
            logger.warn(
              `Permission ${permName} not found for business ${businessId}`,
            );
          }
        }
      }

      await userRoleTemplateRepository.create({
        data: {
          businessId,
          name,
          description: description || '',
          isSystem: isSystem || false,
          hierarchy: hierarchy || { level: 999 },
          basePermissions: permissionIds,
          parentRoleId,
        },
        session,
      });

      logger.debug(`Created role template ${name} for business ${businessId}`);
    }

    logger.info(`Completed seeding role templates for business ${businessId}`);
  },
};
