import { logger } from '../../../lib/logger';
import { mongoService } from '../../../lib/mongo';
import { permissionRegistry } from '../permissions';
import {
  roleTemplateRegistry,
  roleTemplatesByBusinessType,
} from '../role-templates';
import { permissionSeederService } from './permission-seeder.service';
import { roleTemplateSeederService } from './role-template-seeder.service';

export const businessSeederService = {
  async seedNewBusiness(
    businessId: string,
    businessType: string = 'default',
  ): Promise<void> {
    logger.info(
      `Starting permission seeding for new business ${businessId} of type ${businessType}`,
    );

    try {
      await mongoService.withTransaction(async session => {
        const createdPermissions =
          await permissionSeederService.seedPermissions(
            businessId,
            permissionRegistry,
            session,
          );

        const templates =
          roleTemplatesByBusinessType[businessType] || roleTemplateRegistry;
        await roleTemplateSeederService.seedRoleTemplates(
          businessId,
          templates,
          createdPermissions,
          session,
        );
      });

      logger.info(
        `Successfully completed permission seeding for business ${businessId}`,
      );
    } catch (error) {
      logger.error(`Error seeding permissions for business ${businessId}`, {
        error,
      });
      throw error;
    }
  },

  async updateExistingBusiness(businessId: string): Promise<void> {
    logger.info(`Updating permissions for existing business ${businessId}`);

    try {
      await mongoService.withTransaction(async session => {
        const createdPermissions =
          await permissionSeederService.seedPermissions(
            businessId,
            permissionRegistry,
            session,
          );

        const systemTemplates = roleTemplateRegistry.filter(t => t.isSystem);
        await roleTemplateSeederService.seedRoleTemplates(
          businessId,
          systemTemplates,
          createdPermissions,
          session,
        );
      });

      logger.info(
        `Successfully updated permissions for business ${businessId}`,
      );
    } catch (error) {
      logger.error(`Error updating permissions for business ${businessId}`, {
        error,
      });
      throw error;
    }
  },
};
