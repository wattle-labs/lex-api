import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document';
import { Party } from './interfaces/party';
import { partySchema } from './schemas/party.schema';

const PartyModel = model<MongooseModel<Party>>('Party', partySchema, 'parties');

// PartyModel.createIndexes()

export default PartyModel;
