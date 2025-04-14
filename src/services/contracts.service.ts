import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ContractRepository, contractRepository } from '../repositories';
import { BaseService } from './base.service';

export class ContractsService extends BaseService<MongooseModel<Contract>> {
  constructor(repository: ContractRepository) {
    super(repository, 'contract');
  }

  async findByBusinessId(businessId: string): Promise<Contract | null> {
    const repository = this.repository as ContractRepository;
    return await repository.findByBusinessId(businessId);
  }
}

export const contractsService = new ContractsService(contractRepository);
