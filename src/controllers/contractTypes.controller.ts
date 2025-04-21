import { ContractType } from '../models/interfaces/contractType';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ContractTypeService } from '../services/contractTypes.service';
import { BaseController } from './base.controller';

class ContractTypeController extends BaseController<
  MongooseModel<ContractType>,
  ContractTypeService
> {
  constructor(service: ContractTypeService) {
    super(service, 'contractType');
  }
}

export default ContractTypeController;
