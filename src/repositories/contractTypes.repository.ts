import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import ContractTypeModel from '../models/contractTypes.model';
import { ContractType } from '../models/interfaces/contractType';
import { MongooseModel } from '../models/interfaces/document';
import { BaseRepository } from './base.repository';

export class ContractTypeRepository extends BaseRepository<
  MongooseModel<ContractType>
> {
  constructor(model: Model<MongooseModel<ContractType>>) {
    super(model);
  }

  async findByShortName(shortName: string): Promise<ContractType | null> {
    const result = await this.findOne({ filter: { shortName } });
    return result;
  }
}

export const contractTypeRepository = mongoService.createRepository(
  ContractTypeRepository,
  ContractTypeModel,
);
