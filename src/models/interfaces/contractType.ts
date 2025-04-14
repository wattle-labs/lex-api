import { ObjectId } from 'mongoose';

export interface ContractTypeKeyTerm {
  term: string;
  description: string;
  outputFormat: string;
  sampleOutput: string[];
}

export interface ContractType {
  id?: string | ObjectId;
  shortName: string;
  longName: string;
  description?: string;
  keyTerms: ContractTypeKeyTerm[];
  createdAt?: Date;
  updatedAt?: Date;
}
