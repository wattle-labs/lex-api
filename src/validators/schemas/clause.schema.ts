// Generated by ts-to-zod
import { z } from 'zod';

const objectIdSchema = z.any();

/**
 * This interface is used to represent a clause instance in a contract. Can either be:
 * - A standard form clause, i.e., a clause that represents the gold standard against which to compare extracted clauses for any violations/deviations
 * - An example clause, i.e., a clause that is used as an example for training the model
 * - An extracted clause, i.e., a clause that is extracted from the contract text
 */
export const clauseSchema = z.object({
  id: z.union([z.string(), objectIdSchema]).optional(),
  /**
   * The id of the clause definition that this clause is based on.
   */
  clauseDefinitionId: z.union([z.string(), objectIdSchema]),
  /**
   * The due date of the obligation.
   */
  dueDate: z.date().optional(),
  /**
   * The responsible party for the obligation.
   */
  responsibleParty: z.union([z.string(), objectIdSchema]).optional(),
  /**
   * The value of the clause.
   */
  value: z.union([z.string(), z.number()]).optional(),
  /**
   * The snippet of the clause, once extracted from the contract text.
   */
  snippet: z.string().optional(),
  /**
   * True if the clause is a standard form clause, i.e., gold standard against which to compare extracted clauses for any violations/deviations
   */
  isStandardForm: z.boolean().optional(),
  /**
   * The label of the standard form option, if the clause is a standard form clause,
   */
  standardFormOptionType: z
    .union([z.literal('preferred'), z.literal('fallback')])
    .optional(),
  /**
   * True if the clause is an example clause, i.e., a clause that is used as an example for training the model
   */
  isExample: z.boolean().optional(),
  /**
   * Context to give the model to help it choose the correct standard form option or example option
   */
  usageCriteria: z.string().optional(),
  /**
   * The business that the clause belongs to. If not specified, the clause will be available to all businesses.
   * MUST be specified if isCustom is true.
   */
  businessId: z.union([z.string(), objectIdSchema]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});
