import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import ContractModel from '../models/contracts.model';
import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BaseRepository } from './base.repository';

export class ContractRepository extends BaseRepository<
  MongooseModel<Contract>
> {
  constructor(model: Model<MongooseModel<Contract>>) {
    super(model);
  }
}

export const contractRepository = mongoService.createRepository(
  ContractRepository,
  ContractModel,
);
