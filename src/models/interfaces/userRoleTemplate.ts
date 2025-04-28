import { ObjectId } from 'mongoose';

export interface UserRoleTemplate {
  id?: string | ObjectId;
  businessId: string | ObjectId;
  name: string;
  description?: string;
  isSystem: boolean;

  parentRoleId?: string | ObjectId;

  hierarchy: {
    level: number;

    domain?: string;
    canManageRoles?: (string | ObjectId)[];
  };
  basePermissions: (string | ObjectId)[];
  metaPermissions?: {
    canInviteUsers: boolean;
    canCreateProjects: boolean;
    canAssignRoles: boolean;
    canManageTeams: boolean;
    canApproveContracts: boolean;
    canExportData: boolean;
    canAccessReports: boolean;
    canManageSettings: boolean;
  };
  constraints?: {
    maxProjects?: number;
    regionRestriction?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
