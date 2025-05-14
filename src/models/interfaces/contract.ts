import { ObjectId } from 'mongoose';

export enum ContractStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  ERROR = 'error',
}

export interface ContractTerm {
  term: string;
  id: string;
  value: string | number;
  snippet: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface ContractObligation {
  id: string;
  label: string;
  dueDate?: Date;
  responsibleParty?: string | ObjectId;
  updatedAt: Date;
  updatedBy: string;
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
  obligations: Record<string, ContractObligation>;
  text?: string;
  fileName: string;
  contractTypeId?: string | ObjectId;
  summary?: string;
  label: string;
  terms?: Record<string, ContractTerm>;
  businessId: string | ObjectId;
  tags: string[];
  status: ContractStatus;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
