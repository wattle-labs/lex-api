import { logger } from '../lib/logger';
import { mongoService } from '../lib/mongo';
import { Business } from '../models/interfaces/business';
import { MongooseModel } from '../models/interfaces/document.interface';
import { Invitation } from '../models/interfaces/invitation';
import { UserPermission } from '../models/interfaces/userPermission';
import { UserRole } from '../models/interfaces/userRole';
import { UserRoleTemplate } from '../models/interfaces/userRoleTemplate';
import { businessSeederService } from '../rbac/seeding/services/business-seeder.service';
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

    const newBusiness = await this.businessRepository.create({
      data: {
        ...data,
        setup: {
          status: 'pending',
          completedSteps: [],
        },
      },
    });

    try {
      await businessSeederService.seedNewBusiness(
        newBusiness._id.toString(),
        'default',
      );

      await this.businessRepository.update({
        filter: { _id: newBusiness.id },
        push: {
          'setup.completedSteps': ['role_template_created'],
        },
      });

      logger.info(
        `Role templates seeded for new business: ${newBusiness.name}`,
        {
          businessId: newBusiness.id,
        },
      );
    } catch (error) {
      logger.error('Failed to seed role templates for new business', {
        businessId: newBusiness.id,
        error,
      });
    }

    return newBusiness;
  }

  async createPermission(
    businessId: string,
    data: Partial<UserPermission>,
  ): Promise<UserPermission> {
    const permission = await userPermissionRepository.create({
      data,
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

    const existingPermissionIds = template.basePermissions.map(p =>
      typeof p === 'string' ? p : p.toString(),
    );

    const newPermissionIds = permissionIds.filter(
      id => !existingPermissionIds.includes(id),
    );

    if (newPermissionIds.length === 0) {
      return template;
    }

    return await userRoleTemplateRepository.update({
      filter: { _id: templateId },
      push: { basePermissions: newPermissionIds },
    });
  }

  async deleteRoleTemplate(
    businessId: string,
    templateId: string,
  ): Promise<boolean> {
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

  async createBusiness(businessData: Partial<Business>): Promise<Business> {
    try {
      return await mongoService.withTransaction(async session => {
        const business = await businessRepository.create({
          data: businessData,
          session,
        });

        return business;
      });
    } catch (error) {
      logger.error('Error creating business with permissions', { error });
      throw error;
    }
  }
}

export const businessService = new BusinessService(businessRepository);
