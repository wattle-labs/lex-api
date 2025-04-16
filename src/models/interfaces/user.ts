import { ObjectId } from 'mongoose';

export interface User {
  id?: string | ObjectId;
  /**
   * ID from auth provider
   */
  externalId: string;
  /**
   * Primary email address
   * @format email
   */
  email: string;
  businessId: string | ObjectId;
  otherBusinesses?: (string | ObjectId)[];
  status: string;
  onboarding: {
    completedAt?: Date;
    invitationId?: string | ObjectId;
    isBusinessOwner: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    jobTitle?: string;
    department?: string;
    region?: string;
    timezone?: string;
  };
  hierarchy?: {
    /**
     * Direct supervisor/manager
     */
    managerId?: string | ObjectId;
    /**
     * Hierarchy level (lower = higher rank)
     */
    level?: number;
    /**
     * Users reporting to this user
     */
    directReports?: (string | ObjectId)[];
  };
  authProvider: {
    provider: string;
    lastLogin?: Date;
    metadata?: Record<string, unknown>;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
