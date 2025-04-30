import { ObjectId } from 'mongoose';

export interface UserPermission {
  id?: string | ObjectId;

  name: string;
  description: string;

  resource: string;

  subResource?: string;

  action: string;

  category: string;

  implications?: string[];

  isSystem: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
