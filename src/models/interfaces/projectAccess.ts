import { ObjectId } from 'mongoose';

export interface ProjectAccess {
  id?: string | ObjectId;
  projectId: string | ObjectId;
  userId: string | ObjectId;
  businessId: string | ObjectId;

  accessTypes: string[];

  inherited: boolean;
  source: {
    grantedBy: string | ObjectId;

    grantedAt?: Date;

    reasonCode?: string;

    comment?: string;
  };
  constraints?: {
    expiresAt?: Date;

    conditions?: Record<string, unknown>;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
