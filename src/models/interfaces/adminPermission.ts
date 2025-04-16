import { ObjectId } from 'mongoose';

export interface AdminPermission {
  id?: string | ObjectId;
  name: string;
  description: string;
  resource: string;
  action: string;
  category: string;
  implications: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
