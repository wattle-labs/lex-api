import { PermissionDefinition } from './permission-definition.interface';

export interface RoleTemplateDefinition {
  name: string;
  description?: string;
  permissions: PermissionDefinition[];
  isSystem?: boolean;
  hierarchy?: {
    level: number;
    domain?: string;
  };
  businessTypes?: string[];
  parentRoleName?: string;
}
