import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document.interface';
import { UserRole } from './interfaces/userRole';
import { userRoleSchema } from './schemas/userRole.schema';

const UserRoleModel = model<MongooseModel<UserRole>>(
  'UserRole',
  userRoleSchema,
  'userRoles',
);

export default UserRoleModel;
