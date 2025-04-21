import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ContractService } from '../services/contracts.service';
import { BaseController } from './base.controller';

class ContractController extends BaseController<
  MongooseModel<Contract>,
  ContractService
> {
  constructor(service: ContractService) {
    super(service, 'contract');
  }
}

export default ContractController;
