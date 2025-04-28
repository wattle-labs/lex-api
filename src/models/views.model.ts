import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document';
import { View } from './interfaces/view';
import { viewSchema } from './schemas/views.schema';

const ViewModel = model<MongooseModel<View>>('View', viewSchema, 'views');

export default ViewModel;
