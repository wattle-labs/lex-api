import { ObjectId } from 'mongoose';

export interface ProjectAccess {
  id?: string | ObjectId;
  projectId: string | ObjectId;
  userId: string | ObjectId;
  businessId: string | ObjectId;
  /**
   * Array of access types ("view", "edit", "admin")
   */
  accessTypes: string[];
  /**
   * Whether access was inherited from role
   */
  inherited: boolean;
  source: {
    /**
     * Who granted this access
     */
    grantedBy: string | ObjectId;
    /**
     * When access was granted
     */
    grantedAt?: Date;
    /**
     * Optional reason for access grant
     */
    reasonCode?: string;
    /**
     * Optional explanation
     */
    comment?: string;
  };
  constraints?: {
    /**
     * Optional access expiration
     */
    expiresAt?: Date;
    /**
     * Custom conditional restrictions
     */
    conditions?: Record<string, unknown>;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
