import { UserPermission } from '../../models/interfaces/userPermission';
import { Permission } from '../domain/models/permission';

export const PermissionAdapter = {
  toDomain(model: UserPermission): Permission {
    return new Permission(
      model.resource,
      model.action,
      model.subResource || undefined,
    );
  },

  toPersistence(permission: Permission): Partial<UserPermission> {
    return {
      resource: permission.resource,
      action: permission.action,
      subResource: permission.subResource || undefined,
      name: permission.toString(),
    };
  },
};
