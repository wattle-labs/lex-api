import { model } from 'mongoose';

import { AdminPermission } from './interfaces/adminPermission';
import { MongooseModel } from './interfaces/document.interface';
import { adminPermissionSchema } from './schemas/adminPermission.schema';

const AdminPermissionModel = model<MongooseModel<AdminPermission>>(
  'AdminPermission',
  adminPermissionSchema,
  'adminPermissions',
);

export default AdminPermissionModel;
