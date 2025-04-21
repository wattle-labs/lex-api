import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import BusinessModel from '../models/businesses.model';
import { Business } from '../models/interfaces/business';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BaseRepository } from './base.repository';

export class BusinessRepository extends BaseRepository<
  MongooseModel<Business>
> {
  constructor(model: Model<MongooseModel<Business>>) {
    super(model);
  }

  async findBySlug(slug: string): Promise<Business | null> {
    const result = await this.findOne({ filter: { slug } });
    return result;
  }
}

export const businessRepository = mongoService.createRepository(
  BusinessRepository,
  BusinessModel,
);
