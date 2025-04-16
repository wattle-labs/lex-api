import { MongooseModel } from '../models/interfaces/document.interface';
import { UserRoleTemplate } from '../models/interfaces/userRoleTemplate';
import {
  UserRoleTemplateRepository,
  userRoleTemplateRepository,
} from '../repositories/userRoleTemplates.repository';
import { BaseService } from './base.service';

export class RoleTemplateService extends BaseService<
  MongooseModel<UserRoleTemplate>
> {
  private roleTemplateRepository: UserRoleTemplateRepository;

  constructor(repository: UserRoleTemplateRepository) {
    super(repository, 'userRoleTemplate');
    this.roleTemplateRepository = repository;
  }

  async findByBusinessId(businessId: string): Promise<UserRoleTemplate[]> {
    return await this.roleTemplateRepository.findByBusinessId(businessId);
  }

  async findByBusinessAndName(
    businessId: string,
    name: string,
  ): Promise<UserRoleTemplate | null> {
    return await this.roleTemplateRepository.findByBusinessAndName(
      businessId,
      name,
    );
  }

  async findSystemRoles(businessId: string): Promise<UserRoleTemplate[]> {
    return await this.roleTemplateRepository.findSystemRoles(businessId);
  }

  async findByHierarchyLevel(
    businessId: string,
    level: number,
  ): Promise<UserRoleTemplate[]> {
    return await this.roleTemplateRepository.findByHierarchyLevel(
      businessId,
      level,
    );
  }
}

export const roleTemplateService = new RoleTemplateService(
  userRoleTemplateRepository,
);
