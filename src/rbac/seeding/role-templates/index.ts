import { RoleTemplateDefinition } from '../interfaces/role-template-definition.interface';
import { businessRoleTemplates } from './business.role-templates';

export const roleTemplateRegistry: RoleTemplateDefinition[] = [
  ...businessRoleTemplates,
];

export const roleTemplatesByLevel = roleTemplateRegistry.reduce(
  (acc, template) => {
    const level = template.hierarchy?.level || 999;
    acc[level] = [...(acc[level] || []), template];
    return acc;
  },
  {} as Record<number, RoleTemplateDefinition[]>,
);

export const roleTemplatesByBusinessType = roleTemplateRegistry.reduce(
  (acc, template) => {
    const businessTypes = template.businessTypes || ['default'];
    businessTypes.forEach(type => {
      acc[type] = [...(acc[type] || []), template];
    });
    return acc;
  },
  {} as Record<string, RoleTemplateDefinition[]>,
);
