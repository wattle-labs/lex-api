import { z as zod } from 'zod';

export const createPathParamValidator = (
  field: string,
  errorMessage?: string,
) =>
  zod.object({
    [field]: zod.string().min(1, errorMessage || `${field} is required`),
  });
