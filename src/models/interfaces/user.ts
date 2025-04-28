import { ObjectId } from 'mongoose';

export interface User {
  id?: string | ObjectId;

  externalId: string;

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
    managerId?: string | ObjectId;

    level?: number;

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
