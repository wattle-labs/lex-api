import { ObjectId } from 'mongoose';

export interface Admin {
  id?: string | ObjectId;
  userId: string | ObjectId;
  email: string;
  adminRoleTemplateId: string | ObjectId;
  customPermissions: Array<{
    permission: string | ObjectId;
    granted: boolean;
    resources: string[];
  }>;
  scope?: {
    businessIds: string[] | ObjectId[];
    features: string[];
  };
  addedBy: string | ObjectId;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
