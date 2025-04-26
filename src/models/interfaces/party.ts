import { ObjectId } from 'mongoose';

export interface Party {
  id?: string | ObjectId;
  /**
   * Party name
   * @minLength 1 Name is required
   */
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
