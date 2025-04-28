import { model } from 'mongoose';

import { AdminRoleTemplate } from './interfaces/adminRoleTemplate';
import { MongooseModel } from './interfaces/document.interface';
import { adminRoleTemplateSchema } from './schemas/adminRoleTemplate.schema';

const AdminRoleTemplateModel = model<MongooseModel<AdminRoleTemplate>>(
  'AdminRoleTemplate',
  adminRoleTemplateSchema,
  'adminRoleTemplates',
);

export default AdminRoleTemplateModel;
