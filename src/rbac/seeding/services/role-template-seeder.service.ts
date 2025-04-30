import { ClientSession, ObjectId } from 'mongoose';

import { logger } from '../../../lib/logger';
import { userPermissionRepository } from '../../../repositories/userPermissions.repository';
import { userRoleTemplateRepository } from '../../../repositories/userRoleTemplates.repository';
import { RoleTemplateDefinition } from '../interfaces/role-template-definition.interface';

export const roleTemplateSeederService = {
  async seedRoleTemplates(
    businessId: string,
    roleTemplates: RoleTemplateDefinition[],
    session?: ClientSession,
  ): Promise<void> {
    logger.info(
      `Seeding ${roleTemplates.length} role templates for business ${businessId}`,
    );

    const userPermissions = await userPermissionRepository.find({
      filter: { businessId: { $exists: false } },
    });

    const permissionNameToId = new Map<string, string>();
    userPermissions.forEach(p => {
      if (p.id) {
        permissionNameToId.set(p.name, p.id.toString());
      }
    });

    logger.info(
      `Found ${userPermissions.length} UserPermissions for reference`,
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
      const missingPermissions: string[] = [];

      for (const permDef of permissions) {
        const permName = permDef.subResource
          ? `${permDef.resource}:${permDef.subResource}:${permDef.action}`
          : `${permDef.resource}:${permDef.action}`;

        const permId = permissionNameToId.get(permName);

        if (permId) {
          permissionIds.push(permId);
        } else {
          missingPermissions.push(permName);
        }
      }

      if (missingPermissions.length > 0) {
        logger.warn(
          `Could not find these global permissions: ${missingPermissions.join(
            ', ',
          )}. Make sure to run the seed:permissions script first.`,
        );
      }

      if (permissionIds.length === 0) {
        logger.warn(
          `No valid permissions found for role template ${name}. Template will be created with empty permissions.`,
        );
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

      logger.debug(
        `Created role template ${name} for business ${businessId} with ${permissionIds.length} permissions`,
      );
    }

    logger.info(`Completed seeding role templates for business ${businessId}`);
  },
};
