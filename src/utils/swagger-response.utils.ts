import { z as zod } from 'zod';

export const ErrorResponseSchema = zod.object({
  success: zod.literal(false),
  message: zod.string(),
  error: zod.string().optional(),
});

export const createSuccessResponseSchema = <T extends zod.ZodTypeAny>(
  dataSchema: T,
) =>
  zod.object({
    success: zod.literal(true),
    data: dataSchema,
    message: zod.string().optional(),
  });

export const createPaginatedResponseSchema = <T extends zod.ZodTypeAny>(
  schema: T,
) => {
  return zod
    .object({
      success: zod.boolean().default(true),
      data: zod.array(schema),
      total: zod.number().int().nonnegative(),
      page: zod.number().int().positive(),
      pageSize: zod.number().int().positive(),
    })
    .strict();
};
