import { ObjectId } from 'mongoose';

export interface Clause {
  id?: string | ObjectId;
  name: string; // Previously "term"
  description: string;
  outputFormat: string;
  sampleOutput?: string[];
  /**
   * Whether the clause is a standard clause, i.e., provided by Clarus (vs. custom, i.e., created by the user)
   * If true, the clause will be automatically added to all new contract types.
   */
  isStandard: boolean;
  /**
   * Whether the clause is an obligation
   * Defaults to false
   */
  isObligation?: boolean;
  /**
   * The due date of the obligation.
   */
  dueDate?: Date;
  /**
   * The responsible party for the obligation.
   */
  responsibleParty?: string | ObjectId;
  /**
   * The type of obligation (or other category) of the clause.
   */
  type?: string;
  /**
   * The value of the clause.
   */
  value?: string | number;
  /**
   * The snippet of the clause, once extracted from the contract text.
   */
  snippet?: string;
  /**
   * The contract types that the clause belongs to / is applicable to. If not specified, the clause will be applicable to all contract types.
   * The key is the contract type id, and the value is true if the clause is applicable to the contract type.
   */
  contractTypes?: string[] | ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
