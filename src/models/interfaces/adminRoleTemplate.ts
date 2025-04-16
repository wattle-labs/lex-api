import { ObjectId } from 'mongoose';

export interface AdminRoleTemplate {
  id?: string | ObjectId;
  name: string;
  description: string;
  basePermissions: string[];
  hierarchy: {
    level: number;
    canManageRoles: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}
