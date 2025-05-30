import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import ClauseModel from '../models/clauses.model';
import { Clause } from '../models/interfaces/clause';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BaseRepository } from './base.repository';

export class ClauseRepository extends BaseRepository<MongooseModel<Clause>> {
  constructor(model: Model<MongooseModel<Clause>>) {
    super(model);
  }
}

export const clauseRepository = mongoService.createRepository(
  ClauseRepository,
  ClauseModel,
);
