import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { User } from '../models/interfaces/user';
import UserModel from '../models/users.model';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<MongooseModel<User>> {
  constructor(model: Model<MongooseModel<User>>) {
    super(model);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.findOne({ filter: { email } });
    return result;
  }

  async findByExternalId(externalId: string): Promise<User | null> {
    const result = await this.findOne({ filter: { externalId } });
    return result;
  }

  async findUsersByBusiness(businessId: string): Promise<User[]> {
    const results = await this.find({
      filter: { businessId, status: 'active' },
    });
    return results;
  }

  async findUsersByManager(managerId: string): Promise<User[]> {
    const results = await this.find({
      filter: { 'hierarchy.managerId': managerId },
    });
    return results;
  }
}

export const userRepository = mongoService.createRepository(
  UserRepository,
  UserModel,
);
