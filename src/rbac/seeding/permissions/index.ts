import { PermissionDefinition } from '../interfaces/permission-definition.interface';
import { businessPermissions } from './business.permissions';
import { contractPermissions } from './contract.permissions';
import { projectPermissions } from './project.permissions';
import { userPermissions } from './user.permissions';

export const permissionRegistry: PermissionDefinition[] = [
  ...projectPermissions,
  ...businessPermissions,
  ...userPermissions,
  ...contractPermissions,
];

export const permissionsByCategory = permissionRegistry.reduce(
  (acc, permission) => {
    const category = permission.category || 'General';
    acc[category] = [...(acc[category] || []), permission];
    return acc;
  },
  {} as Record<string, PermissionDefinition[]>,
);

export const permissionsByResource = permissionRegistry.reduce(
  (acc, permission) => {
    acc[permission.resource] = [
      ...(acc[permission.resource] || []),
      permission,
    ];
    return acc;
  },
  {} as Record<string, PermissionDefinition[]>,
);
