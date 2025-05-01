import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document';
import { View } from '../models/interfaces/view';
import {
  ViewsRepository,
  contractRepository,
  usersRepository,
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

  /**
   * @todo: This is not working as expected, need to verify and fix.
   * Create a new view, and save it to the user's viewIds array
   * @param data - The view data
   * @returns The created view
   */
  async create(data: MongooseModel<View>): Promise<MongooseModel<View>> {
    if (!data.criteria) {
      throw new Error('Criteria is required');
    }

    const view = await this.repository.create({ data });
    console.log('viewId: ', view._id);

    const userDocs = await usersRepository.find({
      filter: { id: { $in: data.userIds } },
      options: {
        fields: 'id',
      },
    });
    await Promise.all(
      userDocs.map(async user => {
        await usersRepository.update({
          filter: { id: user.id },
          update: { $push: { viewIds: view._id } },
        });
      }),
    );

    return view;
  }
}

export const viewsService = new ViewsService(viewsRepository);
