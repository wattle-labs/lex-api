import { AdminRoleTemplate } from '../models/interfaces/adminRoleTemplate';
import { MongooseModel } from '../models/interfaces/document.interface';
import {
  AdminRoleTemplateRepository,
  adminRoleTemplateRepository,
} from '../repositories';
import { BaseService } from './base.service';

export class AdminRoleTemplateService extends BaseService<
  MongooseModel<AdminRoleTemplate>
> {
  private adminRoleTemplateRepository: AdminRoleTemplateRepository;

  constructor(repository: AdminRoleTemplateRepository) {
    super(repository, 'adminRoleTemplates');
    this.adminRoleTemplateRepository = repository;
  }

  async findByName(name: string): Promise<AdminRoleTemplate | null> {
    return await this.adminRoleTemplateRepository.findByName(name);
  }
}

export const adminRoleTemplateService = new AdminRoleTemplateService(
  adminRoleTemplateRepository,
);
