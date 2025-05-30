import { model } from 'mongoose';

import { ClauseDefinition } from './interfaces/clauseDefinition';
import { MongooseModel } from './interfaces/document.interface';
import { clauseDefinitionSchema } from './schemas/clauseDefinition.schema';

const ClauseDefinitionModel = model<MongooseModel<ClauseDefinition>>(
  'ClauseDefinition',
  clauseDefinitionSchema,
  'clauseDefinitions',
);

export default ClauseDefinitionModel;
