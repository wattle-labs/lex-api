import { ObjectId } from 'mongoose';

export enum ContractStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  ERROR = 'error',
}

export interface ContractTerm {
  term: string;
  value: string | number;
  snippet: string;
}

export interface Contract {
  id?: string | ObjectId;
  url: string;
  gsBucketName?: string;
  fileName: string;
  contractTypeId?: string | ObjectId;
  summary?: string;
  terms?: ContractTerm[];
  businessId: string | ObjectId;
  tags: string[];
  status: ContractStatus;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
