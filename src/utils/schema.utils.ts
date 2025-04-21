import { z as zod } from 'zod';

export const mergeValidators = <T extends zod.ZodRawShape>(
  ...validators: zod.ZodObject<zod.ZodRawShape>[]
) => {
  return validators.reduce(
    (mergedValidator, validator) => mergedValidator.merge(validator),
    zod.object({}) as zod.ZodObject<T>,
  );
};
