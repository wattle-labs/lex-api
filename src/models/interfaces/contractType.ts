import { ObjectId } from 'mongoose';

import { Clause } from './clause';

export interface ContractType {
  id?: string | ObjectId;
  shortName: string;
  longName: string;
  description?: string;
  /**
   * The **standard** clauses that are applicable to the contract type, set during initialization
   * ONLY for standard clauses (i.e., clauses that have isCustom set to false or undefined)
   */
  clauses: string[] | ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContractTypePopulated extends Omit<ContractType, 'clauses'> {
  clauses: Clause[];
}
