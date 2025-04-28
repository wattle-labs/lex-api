import { ObjectId } from 'mongoose';

export interface AuthProvider {
  id?: string | ObjectId;

  provider: string;
  isActive: boolean;
  metadataMap: {
    userId: string;
    email: string;
    name: string;
    roles: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
