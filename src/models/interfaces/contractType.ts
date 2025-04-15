import { ObjectId } from 'mongoose';

export interface ContractKeyTermDefinition {
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
  keyTerms: ContractKeyTermDefinition[];
  createdAt?: Date;
  updatedAt?: Date;
}
