import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import AdminRoleTemplateModel from '../models/adminRoleTemplates.model';
import { AdminRoleTemplate } from '../models/interfaces/adminRoleTemplate';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BaseRepository } from './base.repository';

export class AdminRoleTemplateRepository extends BaseRepository<
  MongooseModel<AdminRoleTemplate>
> {
  constructor(model: Model<MongooseModel<AdminRoleTemplate>>) {
    super(model);
  }

  async findByName(name: string): Promise<AdminRoleTemplate | null> {
    const result = await this.findOne({ filter: { name } });
    return result;
  }
}

export const adminRoleTemplateRepository = mongoService.createRepository(
  AdminRoleTemplateRepository,
  AdminRoleTemplateModel,
);
