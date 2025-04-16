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
   * Action ("create", "read", "update", etc.)
   */
  action: string;
  /**
   * Grouping ("legal", "sales", "admin")
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
