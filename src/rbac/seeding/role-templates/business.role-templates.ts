import { rolePermissionRules } from '../constants/role-permissions.constants';
import { RoleTemplateDefinition } from '../interfaces/role-template-definition.interface';
import { permissionRegistry } from '../permissions';
import { applyPermissionRules } from '../utils/permission-filter.utils';

export const businessRoleTemplates: RoleTemplateDefinition[] = [
  {
    name: 'Business Administrator',
    description: 'Full access to all business resources',
    hierarchy: {
      level: 1,
      domain: 'Administration',
    },
    permissions: applyPermissionRules(
      permissionRegistry,
      rolePermissionRules.BUSINESS_ADMINISTRATOR,
    ),
    isSystem: true,
  },
  {
    name: 'Business Manager',
    description:
      'Can manage most business operations but with limited administrative access',
    hierarchy: {
      level: 2,
      domain: 'Administration',
    },
    permissions: applyPermissionRules(
      permissionRegistry,
      rolePermissionRules.BUSINESS_MANAGER,
    ),
    isSystem: true,
  },
  {
    name: 'Project Manager',
    description: 'Can manage projects and team members',
    hierarchy: {
      level: 3,
      domain: 'Project Management',
    },
    permissions: applyPermissionRules(
      permissionRegistry,
      rolePermissionRules.PROJECT_MANAGER,
    ),
    isSystem: true,
  },
  {
    name: 'Legal Manager',
    description: 'Can manage all contract related operations',
    hierarchy: {
      level: 3,
      domain: 'Legal',
    },
    permissions: applyPermissionRules(
      permissionRegistry,
      rolePermissionRules.LEGAL_MANAGER,
    ),
    isSystem: true,
    businessTypes: ['legal', 'enterprise', 'default'],
  },
  {
    name: 'Team Member',
    description: 'Basic access to projects and limited functionality',
    hierarchy: {
      level: 4,
      domain: 'General',
    },
    permissions: applyPermissionRules(
      permissionRegistry,
      rolePermissionRules.TEAM_MEMBER,
    ),
    isSystem: true,
  },
];
