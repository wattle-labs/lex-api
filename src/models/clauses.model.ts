import { model } from 'mongoose';

import { Clause } from './interfaces/clause';
import { MongooseModel } from './interfaces/document.interface';
import { clauseSchema } from './schemas/clause.schema';

const ClauseModel = model<MongooseModel<Clause>>(
  'Clause',
  clauseSchema,
  'clauses',
);

export default ClauseModel;
