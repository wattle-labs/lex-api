import { Model } from 'mongoose';

import { findAllOptions } from '../interfaces/repository.interface';
import { mongoService } from '../lib/mongo';
import ContractTypeModel from '../models/contractTypes.model';
import { ContractType } from '../models/interfaces/contractType';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BaseRepository } from './base.repository';

export class ContractTypeRepository extends BaseRepository<
  MongooseModel<ContractType>
> {
  constructor(model: Model<MongooseModel<ContractType>>) {
    super(model);
  }

  public async find(
    options: findAllOptions<MongooseModel<ContractType>>,
  ): Promise<MongooseModel<ContractType>[]> {
    const {
      filter,
      fields,
      options: queryOptions,
      limit,
      skip,
      sort,
      session,
    } = options;

    // Populate clauses without the contractTypes field
    let query = this.model
      .find(filter ?? {}, fields, queryOptions)
      .populate('clauses', '-contractTypes');

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    if (skip !== undefined) {
      query = query.skip(skip);
    }

    if (sort) {
      query = query.sort(sort);
    }

    if (session) {
      query = query.session(session);
    }

    const result = await query.lean({ virtuals: true });
    return result as MongooseModel<ContractType>[];
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
