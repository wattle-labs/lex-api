import { userPermissionSchema } from './schemas/userPermission.schema';

export const userPermissionCreateBodyValidator = userPermissionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
