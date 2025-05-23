import { ObjectId } from 'mongoose';

import { Clause } from './clause';

export interface ContractType {
  id?: string | ObjectId;
  shortName: string;
  longName: string;
  description?: string;
  /**
   * The clauses that are applicable to the contract type. References the ids of the clauses.
   * Previously "keyTerms"
   */
  clauses: string[] | ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContractTypePopulated extends Omit<ContractType, 'clauses'> {
  clauses: Clause[];
}
