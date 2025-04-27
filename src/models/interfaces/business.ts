import { ObjectId } from 'mongoose';

export interface Business {
  id?: string | ObjectId;
  /**
   * Business name
   * @minLength 1 Name is required
   */
  name: string;
  /**
   * Business slug - must contain only alphanumeric characters and underscores
   * @pattern ^[a-zA-Z0-9_]+$
   */
  slug: string;
  /**
   * Associated email domains for auto-assignment
   */
  domains: string[];
  settings: {
    defaultRoleId?: string | ObjectId;
    /**
     * Hours invitations remain valid
     */
    invitationExpiry: number;
    /**
     * Whether to strictly enforce hierarchy rules
     */
    enforceHierarchy: boolean;
    /**
     * "restrictive" or "permissive" defaults
     */
    permissionPolicy: string;
  };
  setup: {
    /**
     * "pending", "owner_invited", "active", "suspended"
     */
    status?: string;
    /**
     * Array of completed onboarding steps
     */
    completedSteps?: string[];
    /**
     * Admin who created the business
     */
    createdBy?: string | ObjectId;
    ownerInvitationId?: string | ObjectId;
  };
  /**
   * User who last updated the business
   */
  updatedBy?: string | ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
