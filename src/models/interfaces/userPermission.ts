import { ObjectId } from 'mongoose';

export interface UserPermission {
  id?: string | ObjectId;
  businessId: string | ObjectId;
  /**
   * Unique identifier (e.g., "contract:approve")
   */
  name: string;
  description: string;
  /**
   * Resource type ("contract", "project", etc.)
   */
  resource: string;
  /**
   * Sub-resource type (e.g. "settings", "members", "timeline")
   * This is the second part of the permission name in a 3-part permission
   */
  subResource?: string;
  /**
   * Action ("create", "read", "update", etc.)
   */
  action: string;
  /**
   * Grouping ("legal", "sales", "admin")
   * Used for UI representation only, not for permission logic
   */
  category: string;
  /**
   * Other permissions this includes
   */
  implications?: string[];
  /**
   * System-defined or custom
   */
  isSystem: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
