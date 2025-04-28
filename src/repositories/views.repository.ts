import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document';
import { View } from '../models/interfaces/view';
import ViewModel from '../models/views.model';
import { BaseRepository } from './base.repository';

export class ViewsRepository extends BaseRepository<MongooseModel<View>> {
  constructor(model: Model<MongooseModel<View>>) {
    super(model);
  }
}

export const viewsRepository = mongoService.createRepository(
  ViewsRepository,
  ViewModel,
);
