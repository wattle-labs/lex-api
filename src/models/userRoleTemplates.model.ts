import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document.interface';
import { UserRoleTemplate } from './interfaces/userRoleTemplate';
import { userRoleTemplateSchema } from './schemas/userRoleTemplate.schema';

const UserRoleTemplateModel = model<MongooseModel<UserRoleTemplate>>(
  'UserRoleTemplate',
  userRoleTemplateSchema,
  'userRoleTemplates',
);

export default UserRoleTemplateModel;
