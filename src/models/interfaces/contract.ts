import { ObjectId } from 'mongoose';

import { Clause } from './clause';

export enum ContractStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  ERROR = 'error',
}

export interface Party {
  _id: string | ObjectId | null;
  name: string;
}

export interface Contract {
  id?: string | ObjectId;
  url: string;
  gsBucketName?: string;
  parties: Party[];
  text?: string;
  fileName: string;
  contractTypeId?: string | ObjectId;
  summary?: string;
  label: string;
  clauses?: Record<string, Clause>;
  businessId: string | ObjectId;
  tags: string[];
  status: ContractStatus;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
