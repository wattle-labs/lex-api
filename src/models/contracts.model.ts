import { model } from 'mongoose';

import { Contract } from './interfaces/contract';
import { MongooseModel } from './interfaces/document.interface';
import { contractSchema } from './schemas/contract.schema';

const ContractModel = model<MongooseModel<Contract>>(
  'Contract',
  contractSchema,
  'contracts',
);

export default ContractModel;
