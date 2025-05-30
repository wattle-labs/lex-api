import { ObjectId } from 'mongoose';

/**
 * This interface is used to represent a clause instance in a contract. Can either be:
 * - A standard form clause, i.e., a clause that represents the gold standard against which to compare extracted clauses for any violations/deviations
 * - An example clause, i.e., a clause that is used as an example for training the model
 * - An extracted clause, i.e., a clause that is extracted from the contract text
 */
export interface Clause {
  id?: string | ObjectId;
  /**
   * The id of the clause definition that this clause is based on.
   */
  clauseDefinitionId: string | ObjectId;
  /**
   * The due date of the obligation.
   */
  dueDate?: Date;
  /**
   * The responsible party for the obligation.
   */
  responsibleParty?: string | ObjectId;
  /**
   * The value of the clause.
   */
  value?: string | number;
  /**
   * The snippet of the clause, once extracted from the contract text.
   */
  snippet?: string;
  /**
   * True if the clause is a standard form clause, i.e., gold standard against which to compare extracted clauses for any violations/deviations
   */
  isStandardForm?: boolean;
  /**
   * The label of the standard form option, if the clause is a standard form clause,
   */
  standardFormOptionType?: 'preferred' | 'fallback';
  /**
   * True if the clause is an example clause, i.e., a clause that is used as an example for training the model
   */
  isExample?: boolean;
  /**
   * Context to give the model to help it choose the correct standard form option or example option
   */
  usageCriteria?: string;
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
