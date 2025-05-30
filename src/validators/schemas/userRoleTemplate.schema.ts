// Generated by ts-to-zod
import { z } from 'zod';

const objectIdSchema = z.any();

export const userRoleTemplateSchema = z.object({
  id: z.union([z.string(), objectIdSchema]).optional(),
  businessId: z.union([z.string(), objectIdSchema]),
  name: z.string(),
  description: z.string().optional(),
  isSystem: z.boolean(),
  parentRoleId: z.union([z.string(), objectIdSchema]).optional(),
  hierarchy: z.object({
    level: z.number(),
    domain: z.string().optional(),
    canManageRoles: z.array(z.union([z.string(), objectIdSchema])).optional(),
  }),
  basePermissions: z.array(z.union([z.string(), objectIdSchema])),
  metaPermissions: z
    .object({
      canInviteUsers: z.boolean(),
      canCreateProjects: z.boolean(),
      canAssignRoles: z.boolean(),
      canManageTeams: z.boolean(),
      canApproveContracts: z.boolean(),
      canExportData: z.boolean(),
      canAccessReports: z.boolean(),
      canManageSettings: z.boolean(),
    })
    .optional(),
  constraints: z
    .object({
      maxProjects: z.number().optional(),
      regionRestriction: z.string().optional(),
    })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
