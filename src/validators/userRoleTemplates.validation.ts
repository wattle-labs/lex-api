import { userRoleTemplateSchema } from './schemas/userRoleTemplate.schema';

export const userRoleTemplateCreateBodyValidator = userRoleTemplateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
