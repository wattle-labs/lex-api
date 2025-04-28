import { ObjectId } from 'mongoose';

export interface Business {
  id?: string | ObjectId;

  name: string;

  slug: string;

  domains: string[];
  settings: {
    defaultRoleId?: string | ObjectId;

    invitationExpiry: number;

    enforceHierarchy: boolean;

    permissionPolicy: string;
  };
  setup: {
    status?: string;

    completedSteps?: string[];

    createdBy?: string | ObjectId;
    ownerInvitationId?: string | ObjectId;
  };

  updatedBy?: string | ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
