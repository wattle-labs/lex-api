import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document';
import { View } from '../models/interfaces/view';
import {
  ViewsRepository,
  contractRepository,
  viewsRepository,
} from '../repositories';
import { BaseService } from './base.service';

export class ViewsService extends BaseService<MongooseModel<View>> {
  constructor(repository: ViewsRepository) {
    super(repository, 'view');
  }

  async getContractsForView(
    id: string,
  ): Promise<MongooseModel<View> & { contracts: Contract[] }> {
    const view = await this.repository.findById({ id });
    if (!view) {
      throw new Error('View not found');
    }

    const { filter, sort } = view.criteria;

    if (!filter && !sort) {
      throw new Error('No defined criteria for view');
    }

    const contracts = await contractRepository.find({
      filter,
      sort,
      limit: 1000,
      options: {
        populate: 'contractTypeId',
      },
    });

    return Object.assign(view, { contracts: contracts ?? [] });
  }

  async create(
    data: Partial<MongooseModel<View>>,
  ): Promise<MongooseModel<View>> {
    if (!data.criteria) {
      throw new Error('Criteria is required');
    }
    const view = await this.repository.create({
      data: {
        criteria: {
          filter: data.criteria.filter,
          sort: data.criteria.sort,
        },
      },
    });
    return view;
  }
}

export const viewsService = new ViewsService(viewsRepository);
