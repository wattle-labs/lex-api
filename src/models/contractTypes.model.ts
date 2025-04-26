import { model } from 'mongoose';

import { ContractType } from './interfaces/contractType';
import { MongooseModel } from './interfaces/document';
import { contractTypeSchema } from './schemas/contractType.schema';

const ContractTypeModel = model<MongooseModel<ContractType>>(
  'ContractType',
  contractTypeSchema,
  'contractTypes',
);

export default ContractTypeModel;
