import { ObjectId } from 'mongoose';

export interface User {
  id?: string | ObjectId;
  email: string;
  role: UserStatus;
  profile: UserProfile;
  externalId: string;
  teamIds: string[] | ObjectId[];
  managedTeamIds: string[] | ObjectId[];
  viewIds: string[] | ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface UserProfile {
  firstName: string;
  lastName?: string;
  phone?: string;
  image?: string;
}
