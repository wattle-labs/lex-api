import { FilterQuery, Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { UserPermission } from '../models/interfaces/userPermission';
import UserPermissionModel from '../models/permissions.model';
import { BaseRepository } from './base.repository';

export class UserPermissionRepository extends BaseRepository<
  MongooseModel<UserPermission>
> {
  constructor(model: Model<MongooseModel<UserPermission>>) {
    super(model);
  }

  async findByBusiness(businessId: string): Promise<UserPermission[]> {
    const results = await this.find({
      filter: { businessId } as FilterQuery<MongooseModel<UserPermission>>,
    });
    return results;
  }

  async findByName(
    businessId: string,
    name: string,
  ): Promise<UserPermission | null> {
    const result = await this.findOne({
      filter: { businessId, name } as FilterQuery<
        MongooseModel<UserPermission>
      >,
    });
    return result;
  }

  async findByResourceAndAction(
    businessId: string,
    resource: string,
    action: string,
  ): Promise<UserPermission | null> {
    const result = await this.findOne({
      filter: {
        businessId,
        resource,
        action,
      } as FilterQuery<MongooseModel<UserPermission>>,
    });
    return result;
  }

  async findByCategory(
    businessId: string,
    category: string,
  ): Promise<UserPermission[]> {
    const results = await this.find({
      filter: {
        businessId,
        category,
      } as FilterQuery<MongooseModel<UserPermission>>,
    });
    return results;
  }

  async findSystemPermissions(businessId: string): Promise<UserPermission[]> {
    const results = await this.find({
      filter: {
        businessId,
        isSystem: true,
      } as FilterQuery<MongooseModel<UserPermission>>,
    });
    return results;
  }
}

export const userPermissionRepository = mongoService.createRepository(
  UserPermissionRepository,
  UserPermissionModel,
);
