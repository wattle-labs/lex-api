import { MongooseModel } from '../models/interfaces/document.interface';
import { UserPermission } from '../models/interfaces/userPermission';
import {
  UserPermissionRepository,
  userPermissionRepository,
} from '../repositories/userPermissions.repository';
import { BaseService } from './base.service';

export class UserPermissionService extends BaseService<
  MongooseModel<UserPermission>
> {
  private permissionRepository: UserPermissionRepository;

  constructor(repository: UserPermissionRepository) {
    super(repository, 'userPermissions');
    this.permissionRepository = repository;
  }

  async findByBusiness(businessId: string): Promise<UserPermission[]> {
    return await this.permissionRepository.findByBusiness(businessId);
  }

  async findByName(
    businessId: string,
    name: string,
  ): Promise<UserPermission | null> {
    return await this.permissionRepository.findByName(businessId, name);
  }

  async findByResourceAndAction(
    businessId: string,
    resource: string,
    action: string,
  ): Promise<UserPermission | null> {
    return await this.permissionRepository.findByResourceAndAction(
      businessId,
      resource,
      action,
    );
  }

  async findByCategory(
    businessId: string,
    category: string,
  ): Promise<UserPermission[]> {
    return await this.permissionRepository.findByCategory(businessId, category);
  }

  async findSystemPermissions(businessId: string): Promise<UserPermission[]> {
    return await this.permissionRepository.findSystemPermissions(businessId);
  }

  async createPermission(
    data: Partial<UserPermission>,
  ): Promise<UserPermission> {
    // Generate name if not provided
    if (!data.name && data.resource && data.action) {
      data.name = `${data.resource}:${data.action}`;
    }

    return await this.create(data);
  }
}

export const userPermissionService = new UserPermissionService(
  userPermissionRepository,
);
