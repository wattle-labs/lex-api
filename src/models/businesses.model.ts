import { model } from 'mongoose';

import { Business } from './interfaces/business';
import { MongooseModel } from './interfaces/document.interface';
import { businessSchema } from './schemas/business.schema';

const BusinessModel = model<MongooseModel<Business>>(
  'Business',
  businessSchema,
  'businesses',
);

export default BusinessModel;
