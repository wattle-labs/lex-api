import { ObjectId } from 'mongoose';

export interface CustomPermission {
  permission: string;
  granted: boolean;
  resources?: string[];
  conditions?: Record<string, unknown>;
}

export interface UserRole {
  id?: string | ObjectId;
  userId: string | ObjectId;
  businessId: string | ObjectId;
  userRoleTemplateId: string | ObjectId;
  isActive: boolean;
  scope: {
    /**
     * Applies business-wide
     */
    isGlobal: boolean;
    /**
     * Limited to specific projects
     */
    projectIds?: string[];
  };
  customPermissions?: CustomPermission[];
  assignedBy: string | ObjectId;
  assignedAt?: Date;
  /**
   * Optional expiration
   */
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
