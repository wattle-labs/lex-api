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
  createdAt?: Date;
  updatedAt?: Date;
}
