import { PermissionDefinition } from '../interfaces/permission-definition.interface';

export const contractPermissions: PermissionDefinition[] = [
  {
    resource: 'contract',
    action: 'create',
    description: 'Ability to create contracts',
    category: 'contract_management',
    isSystem: true,
  },
  {
    resource: 'contract',
    action: 'read',
    description: 'Ability to view contracts',
    category: 'contract_management',
    isSystem: true,
  },
  {
    resource: 'contract',
    action: 'update',
    description: 'Ability to update contracts',
    category: 'contract_management',
    isSystem: true,
  },
  {
    resource: 'contract',
    action: 'delete',
    description: 'Ability to delete contracts',
    category: 'contract_management',
    isSystem: true,
  },
  {
    resource: 'contract',
    subResource: 'approval',
    action: 'review',
    description: 'Ability to review contracts for approval',
    category: 'contract_management',
    isSystem: true,
  },
  {
    resource: 'contract',
    subResource: 'approval',
    action: 'approve',
    description: 'Ability to approve contracts',
    category: 'contract_management',
    isSystem: true,
  },
  {
    resource: 'contract',
    subResource: 'approval',
    action: 'reject',
    description: 'Ability to reject contracts',
    category: 'contract_management',
    isSystem: true,
  },
  {
    resource: 'contract',
    subResource: 'type',
    action: 'manage',
    description: 'Ability to manage contract types',
    category: 'contract_management',
    isSystem: true,
  },
];
