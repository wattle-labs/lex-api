import { PermissionDefinition } from '../interfaces/permission-definition.interface';

export const userPermissions: PermissionDefinition[] = [
  {
    resource: 'user',
    action: 'read',
    description: 'Ability to view user details',
    category: 'user_management',
    isSystem: true,
  },
  {
    resource: 'user',
    action: 'update',
    description: 'Ability to update user details',
    category: 'user_management',
    isSystem: true,
  },
  {
    resource: 'user',
    action: 'invite',
    description: 'Ability to invite new users',
    category: 'user_management',
    isSystem: true,
  },
  {
    resource: 'user',
    action: 'delete',
    description: 'Ability to remove users',
    category: 'user_management',
    isSystem: true,
  },
  {
    resource: 'user',
    subResource: 'roles',
    action: 'assign',
    description: 'Ability to assign roles to users',
    category: 'user_management',
    isSystem: true,
  },
  {
    resource: 'user',
    subResource: 'roles',
    action: 'revoke',
    description: 'Ability to revoke roles from users',
    category: 'user_management',
    isSystem: true,
  },
  {
    resource: 'user',
    subResource: 'permissions',
    action: 'manage',
    description: 'Ability to manage user permissions',
    category: 'user_management',
    isSystem: true,
  },
];
