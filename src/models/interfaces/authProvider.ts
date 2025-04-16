import { ObjectId } from 'mongoose';

export interface AuthProvider {
  id?: string | ObjectId;
  /**
   * Auth provider name (e.g., "clerk")
   * @minLength 1 Provider name is required
   */
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
