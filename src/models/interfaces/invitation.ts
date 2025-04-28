import { ObjectId } from 'mongoose';

export interface Invitation {
  id?: string | ObjectId;

  email: string;
  businessId: string | ObjectId;

  status: string;

  role: string;

  inviter: {
    userId?: string | ObjectId;
    name?: string;

    message?: string;
  };
  assignment: {
    roleTemplateId?: string | ObjectId;

    isOwner: boolean;

    managerId?: string | ObjectId;

    departmentId?: string | ObjectId;

    projectAccess?: {
      projectId: string | ObjectId;

      accessTypes: string[];
    }[];
  };

  security?: {
    token: string;

    tokenHash: string;

    createdAt?: Date;

    expiresAt: Date;

    usedAt?: Date;
  };

  reminders?: {
    sentAt: Date;

    method: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
