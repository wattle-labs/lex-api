import { ObjectId } from 'mongoose';

import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document.interface';
import {
  ContractRepository,
  contractRepository,
  contractTypeRepository,
} from '../repositories';
import { BaseService } from './base.service';

export class ContractsService extends BaseService<MongooseModel<Contract>> {
  constructor(repository: ContractRepository) {
    super(repository, 'contract');
  }

  /**
   * Get a contract type reference by short name
   * @param contractType - The short name of the contract type = e.g. "nda", "msa", "sow", etc.
   * @returns The contract type reference
   */
  async getContractTypeRef(
    contractType: string,
  ): Promise<string | ObjectId | null> {
    const contractTypeRef =
      await contractTypeRepository.findByShortName(contractType);
    return contractTypeRef?.id ?? null;
  }
}

export const contractsService = new ContractsService(contractRepository);
