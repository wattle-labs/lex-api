import { logger } from '../../../lib/logger';
import { mongoService } from '../../../lib/mongo';
import {
  roleTemplateRegistry,
  roleTemplatesByBusinessType,
} from '../role-templates';
import { roleTemplateSeederService } from './role-template-seeder.service';

export const businessSeederService = {
  async seedNewBusiness(
    businessId: string,
    businessType: string = 'default',
  ): Promise<void> {
    logger.info(
      `Starting role template seeding for new business ${businessId} of type ${businessType}`,
    );

    try {
      await mongoService.withTransaction(async session => {
        const templates =
          roleTemplatesByBusinessType[businessType] || roleTemplateRegistry;

        await roleTemplateSeederService.seedRoleTemplates(
          businessId,
          templates,
          session,
        );
      });

      logger.info(
        `Successfully completed role template seeding for business ${businessId}`,
      );
    } catch (error) {
      logger.error(`Error seeding role templates for business ${businessId}`, {
        error,
      });
      throw error;
    }
  },

  async updateExistingBusiness(businessId: string): Promise<void> {
    logger.info(`Updating role templates for existing business ${businessId}`);

    try {
      await mongoService.withTransaction(async session => {
        const systemTemplates = roleTemplateRegistry.filter(t => t.isSystem);
        await roleTemplateSeederService.seedRoleTemplates(
          businessId,
          systemTemplates,
          session,
        );
      });

      logger.info(
        `Successfully updated role templates for business ${businessId}`,
      );
    } catch (error) {
      logger.error(`Error updating role templates for business ${businessId}`, {
        error,
      });
      throw error;
    }
  },
};
