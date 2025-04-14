import { ObjectId } from 'mongoose';

export enum ContractStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  ERROR = 'error',
}
export interface Contract {
  id?: string | ObjectId;
  url: string;
  gsBucketName?: string;
  fileName: string;
  contractTypeId?: string | ObjectId;
  summary?: string;
  terms?: Record<string, string>[];
  businessId: string | ObjectId;
  status: ContractStatus;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
