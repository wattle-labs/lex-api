import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ContractsService } from '../services/contracts.service';
import { BaseController } from './base.controller';

class ContractController extends BaseController<
  MongooseModel<Contract>,
  ContractsService
> {
  constructor(service: ContractsService) {
    super(service, 'contract');
  }
}

export default ContractController;
