import { ObjectId } from 'mongoose';

export interface Project {
  id?: string | ObjectId;
  /**
   * Project name
   * @minLength 1 Name is required
   */
  name: string;
  /**
   * User IDs
   */
  userIds: string[] | ObjectId[];
  /**
   * Contract IDs
   */
  contractIds: string[] | ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
