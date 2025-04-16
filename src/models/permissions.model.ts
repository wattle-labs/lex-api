import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document.interface';
import { UserPermission } from './interfaces/userPermission';
import { userPermissionSchema } from './schemas/userPermission.schema';

const UserPermissionModel = model<MongooseModel<UserPermission>>(
  'UserPermission',
  userPermissionSchema,
  'userPermissions',
);

export default UserPermissionModel;
