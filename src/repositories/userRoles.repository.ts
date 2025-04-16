import { FilterQuery, Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { UserRole } from '../models/interfaces/userRole';
import UserRoleModel from '../models/userRoles.model';
import { BaseRepository } from './base.repository';

export class UserRoleRepository extends BaseRepository<
  MongooseModel<UserRole>
> {
  constructor(model: Model<MongooseModel<UserRole>>) {
    super(model);
  }

  async findByUserAndBusiness(
    userId: string,
    businessId: string,
  ): Promise<UserRole[]> {
    const results = await this.find({
      filter: {
        userId,
        businessId,
        isActive: true,
      } as FilterQuery<MongooseModel<UserRole>>,
    });
    return results;
  }

  async findActiveRolesByUser(userId: string): Promise<UserRole[]> {
    const results = await this.find({
      filter: {
        userId,
        isActive: true,
      } as FilterQuery<MongooseModel<UserRole>>,
    });
    return results;
  }

  async findByRoleTemplate(roleTemplateId: string): Promise<UserRole[]> {
    const results = await this.find({
      filter: {
        roleTemplateId,
        isActive: true,
      } as FilterQuery<MongooseModel<UserRole>>,
    });
    return results;
  }

  async findExpiredRoles(): Promise<UserRole[]> {
    const results = await this.find({
      filter: {
        expiresAt: { $lt: new Date() },
        isActive: true,
      } as FilterQuery<MongooseModel<UserRole>>,
    });
    return results;
  }
}

export const userRoleRepository = mongoService.createRepository(
  UserRoleRepository,
  UserRoleModel,
);
