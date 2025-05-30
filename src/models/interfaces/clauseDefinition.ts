import { ObjectId } from 'mongoose';

import { Clause } from './clause';

/**
 * This interface is used to represent a clause definition in the database. It should not be used to represent a clause instance in a contract.
 * This ** DEFINES ** the clause, i.e., the name, description, etc.
 */
export interface ClauseDefinition {
  id?: string | ObjectId;
  name: string; // Previously "term"
  description: string;
  outputFormat: string;
  sampleOutput?: string[];
  /**
   * Whether the clause is a custom clause, i.e., created by the user (vs. standard, i.e., provided by Clarus)
   * If true, the clause will not be automatically added to new contract types or available to other businesses.
   */
  isCustom?: boolean;
  /**
   * True if the clause is an obligation
   */
  isObligation?: boolean;
  /**
   * The type of obligation (or other category) of the clause.
   */
  obligationType?: string;
  /**
   * The contract types that the clause belongs to / is applicable to. If not specified, the clause will be applicable to all contract types.
   * The key is the contract type id, and the value is true if the clause is applicable to the contract type.
   */
  contractTypes?: string[] | ObjectId[];
  /**
   * The business that the clause belongs to. If not specified, the clause will be available to all businesses.
   * MUST be specified if isCustom is true.
   */
  businessId?: string | ObjectId;
  /**
   * The standard clauses that are based on this clause definition.
   * Will be UNIQUE to a business
   */
  standardClauses?: Clause[];
  /**
   * The example clauses that are based on this clause definition.
   * Will be UNIQUE to a business
   */
  exampleClauses?: Clause[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
