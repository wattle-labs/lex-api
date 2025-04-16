import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import AdminPermissionModel from '../models/adminPermissions.model';
import { AdminPermission } from '../models/interfaces/adminPermission';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BaseRepository } from './base.repository';

export class AdminPermissionRepository extends BaseRepository<
  MongooseModel<AdminPermission>
> {
  constructor(model: Model<MongooseModel<AdminPermission>>) {
    super(model);
  }

  async findByName(name: string): Promise<AdminPermission | null> {
    const result = await this.findOne({ filter: { name } });
    return result;
  }
}

export const adminPermissionRepository = mongoService.createRepository(
  AdminPermissionRepository,
  AdminPermissionModel,
);
