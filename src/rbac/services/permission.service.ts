import { Permission } from '../domain/models/permission';

export const permissionService = {
  createPermission(
    resource: string,
    action: string,
    subResource?: string,
  ): Permission {
    return new Permission(resource, action, subResource);
  },

  parsePermission(permissionString: string): Permission {
    return Permission.fromString(permissionString);
  },

  validatePermission(permission: Permission): boolean {
    return !!permission.resource && !!permission.action;
  },

  normalizePermission(permission: Permission): Permission {
    return new Permission(
      permission.resource.toLowerCase(),
      permission.action.toLowerCase(),
      permission.subResource?.toLowerCase(),
    );
  },
};
