import { ObjectId } from 'mongoose';

export interface UserRoleTemplate {
  id?: string | ObjectId;
  businessId: string | ObjectId;
  name: string;
  description?: string;
  isSystem: boolean;
  /**
   * Optional parent role for inheritance
   */
  parentRoleId?: string | ObjectId;
  /**
   * Hierarchy information
   */
  hierarchy: {
    level: number;
    /**
     * Functional area ("legal", "sales")
     */
    domain?: string;
    canManageRoles?: (string | ObjectId)[];
  };
  basePermissions: string[];
  metaPermissions: {
    canInviteUsers: boolean;
    canCreateProjects: boolean;
    canAssignRoles: boolean;
  };
  constraints?: {
    maxProjects?: number;
    regionRestriction?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
