import { FilterQuery, Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { UserRoleTemplate } from '../models/interfaces/userRoleTemplate';
import UserRoleTemplateModel from '../models/userRoleTemplates.model';
import { BaseRepository } from './base.repository';

export class UserRoleTemplateRepository extends BaseRepository<
  MongooseModel<UserRoleTemplate>
> {
  constructor(model: Model<MongooseModel<UserRoleTemplate>>) {
    super(model);
  }

  async findByBusinessId(businessId: string): Promise<UserRoleTemplate[]> {
    const results = await this.find({
      filter: { businessId } as FilterQuery<MongooseModel<UserRoleTemplate>>,
    });
    return results;
  }

  async findByBusinessAndName(
    businessId: string,
    name: string,
  ): Promise<UserRoleTemplate | null> {
    const result = await this.findOne({
      filter: { businessId, name } as FilterQuery<
        MongooseModel<UserRoleTemplate>
      >,
    });
    return result;
  }

  async findSystemRoles(businessId: string): Promise<UserRoleTemplate[]> {
    const results = await this.find({
      filter: { businessId, isSystem: true } as FilterQuery<
        MongooseModel<UserRoleTemplate>
      >,
    });
    return results;
  }

  async findByHierarchyLevel(
    businessId: string,
    level: number,
  ): Promise<UserRoleTemplate[]> {
    const results = await this.find({
      filter: { businessId, 'hierarchy.level': level } as FilterQuery<
        MongooseModel<UserRoleTemplate>
      >,
    });
    return results;
  }
}

export const userRoleTemplateRepository = mongoService.createRepository(
  UserRoleTemplateRepository,
  UserRoleTemplateModel,
);
