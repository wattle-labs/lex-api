import { AdminPermission } from '../models/interfaces/adminPermission';
import { MongooseModel } from '../models/interfaces/document.interface';
import {
  AdminPermissionRepository,
  adminPermissionRepository,
} from '../repositories';
import { BaseService } from './base.service';

export class AdminPermissionService extends BaseService<
  MongooseModel<AdminPermission>
> {
  private adminPermissionRepository: AdminPermissionRepository;

  constructor(repository: AdminPermissionRepository) {
    super(repository, 'adminPermissions');
    this.adminPermissionRepository = repository;
  }

  async findByName(name: string): Promise<AdminPermission | null> {
    return await this.adminPermissionRepository.findByName(name);
  }
}

export const adminPermissionService = new AdminPermissionService(
  adminPermissionRepository,
);
