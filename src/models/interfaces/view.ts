import { Document, FilterQuery, ObjectId, SortOrder } from 'mongoose';

import { Contract } from './contract';

export interface View {
  id?: string | ObjectId;
  /**
   * Project name
   * @minLength 1 Name is required
   */
  name: string;
  /**
   * View type
   * @default ViewType.CONTRACT
   */
  type: 'contract' | 'obligation';
  /**
   * User IDs
   */
  userIds: string[] | ObjectId[];
  criteria: ViewCriteria;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface ViewCriteria {
  filter?: FilterQuery<Contract & Document>;
  sort?: Record<string, SortOrder>;
}
