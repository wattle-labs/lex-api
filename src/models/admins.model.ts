import { model } from 'mongoose';

import { Admin } from './interfaces/admin';
import { MongooseModel } from './interfaces/document.interface';
import { adminSchema } from './schemas/admin.schema';

const AdminModel = model<MongooseModel<Admin>>('Admin', adminSchema, 'admins');

export default AdminModel;
