import { Model } from 'mongoose';

import { findAllOptions } from '../interfaces/repository.interface';
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

  find = async ({
    filter,
    fields,
    options,
    limit,
    skip,
    sort,
  }: findAllOptions<Contract>): Promise<MongooseModel<Contract>[]> => {
    const result = await this.model
      .find(filter ?? {}, fields, options)
      .populate('contractTypeId', 'short_name long_name')
      .limit(limit ?? 10)
      .skip(skip ?? 0)
      .sort(sort);

    return result as MongooseModel<Contract>[];
  };
}

export const contractRepository = mongoService.createRepository(
  ContractRepository,
  ContractModel,
);
