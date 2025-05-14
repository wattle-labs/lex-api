import { ObjectId } from 'mongoose';

import ContractModel from '../models/contracts.model';
import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document.interface';
import PartyModel from '../models/parties.model';
import {
  ContractRepository,
  contractRepository,
  contractTypeRepository,
} from '../repositories';
import { BaseService } from './base.service';

export class ContractService extends BaseService<MongooseModel<Contract>> {
  constructor(repository: ContractRepository) {
    super(repository, 'contract');
  }

  /**
   * Get a contract type reference by short name
   * @param contractType - The short name of the contract type = e.g. "nda", "msa", "sow", etc.
   * @returns The contract type reference
   */
  getContractTypeRef = async (
    contractType: string,
  ): Promise<string | ObjectId | null> => {
    const contractTypeRef =
      await contractTypeRepository.findByShortName(contractType);
    return contractTypeRef?.id ?? null;
  };

  getDashboardStatistics = async () => {
    // TODO: This does not work as expected, problem is in casting to ObjectId.
    const countByStatus = await ContractModel.aggregate([
      {
        $group: {
          _id: { $toObjectId: '$contractTypeId' },
          count: { $sum: 1 },
        },
      },
    ]);

    const countOfParties = await PartyModel.countDocuments();

    return {
      countByStatus,
      countOfParties,
    };
  };
}

export const contractService = new ContractService(contractRepository);
