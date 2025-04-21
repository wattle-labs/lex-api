import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import AdminModel from '../models/admins.model';
import { Admin } from '../models/interfaces/admin';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BaseRepository } from './base.repository';

export class AdminRepository extends BaseRepository<MongooseModel<Admin>> {
  constructor(model: Model<MongooseModel<Admin>>) {
    super(model);
  }

  async findByUserId(userId: string): Promise<Admin | null> {
    const result = await this.findOne({ filter: { userId } });
    return result;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const result = await this.findOne({ filter: { email } });
    return result;
  }
}

export const adminRepository = mongoService.createRepository(
  AdminRepository,
  AdminModel,
);
