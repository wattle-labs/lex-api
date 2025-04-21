import { ContractType } from '../models/interfaces/contractType';
import { MongooseModel } from '../models/interfaces/document.interface';
import {
  ContractTypeRepository,
  contractTypeRepository,
} from '../repositories';
import { BaseService } from './base.service';

export class ContractTypeService extends BaseService<
  MongooseModel<ContractType>
> {
  constructor(repository: ContractTypeRepository) {
    super(repository, 'contractType');
  }

  async findByShortName(shortName: string): Promise<ContractType | null> {
    const repository = this.repository as ContractTypeRepository;
    return await repository.findByShortName(shortName);
  }
}

export const contractTypeService = new ContractTypeService(
  contractTypeRepository,
);
