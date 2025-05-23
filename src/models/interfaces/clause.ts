import { ObjectId } from 'mongoose';

export interface Clause {
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
   * @default false
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
  /**
   * The business that the clause belongs to. If not specified, the clause will be available to all businesses.
   * MUST be specified if isCustom is true.
   */
  businessId?: string | ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}
