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

  async findByBusinessId(businessId: string): Promise<Contract | null> {
    const result = await this.findOne({ filter: { businessId } });
    return result;
  }
}

export const contractRepository = mongoService.createRepository(
  ContractRepository,
  ContractModel,
);
