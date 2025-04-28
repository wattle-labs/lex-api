import { PermissionDefinition } from '../interfaces/permission-definition.interface';

export const projectPermissions: PermissionDefinition[] = [
  {
    resource: 'project',
    action: 'create',
    description: 'Ability to create new projects',
    category: 'project_management',
    isSystem: true,
  },
  {
    resource: 'project',
    action: 'read',
    description: 'Ability to view project details',
    category: 'project_management',
    isSystem: true,
  },
  {
    resource: 'project',
    action: 'update',
    description: 'Ability to update project details',
    category: 'project_management',
    isSystem: true,
  },
  {
    resource: 'project',
    action: 'delete',
    description: 'Ability to delete projects',
    category: 'project_management',
    isSystem: true,
  },
  {
    resource: 'project',
    subResource: 'members',
    action: 'assign',
    description: 'Ability to assign members to a project',
    category: 'project_management',
    isSystem: true,
  },
  {
    resource: 'project',
    subResource: 'members',
    action: 'remove',
    description: 'Ability to remove members from a project',
    category: 'project_management',
    isSystem: true,
  },
  {
    resource: 'project',
    subResource: 'settings',
    action: 'manage',
    description: 'Ability to manage project settings',
    category: 'project_management',
    isSystem: true,
  },
  {
    resource: 'project',
    subResource: 'timeline',
    action: 'update',
    description: 'Ability to update project timeline',
    category: 'project_management',
    isSystem: true,
  },
];
