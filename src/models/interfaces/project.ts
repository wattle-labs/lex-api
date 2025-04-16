import { ObjectId } from 'mongoose';

export interface Project {
  id?: string | ObjectId;
  /**
   * Project name
   * @minLength 1 Name is required
   */
  name: string;
  client: string;
  businessId: string | ObjectId;
  type: string;
  status: string;
  metadata: {
    region?: string;
    department?: string;
    priority?: number;
    tags?: string[];
  };
  ownership: {
    primaryOwnerId: string | ObjectId;
    secondaryOwnerIds?: (string | ObjectId)[];
  };
  dates: {
    created?: Date;
    updated?: Date;
    dueDate?: Date;
    closedDate?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
