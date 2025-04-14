import { z as zod } from 'zod';

import { QUERY_CONFIG } from '../../config/api.config';

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = QUERY_CONFIG;

export const paginationQueryValidator = zod.object({
  page: zod
    .string()
    .optional()
    .default(DEFAULT_PAGE.toString())
    .transform(val => (val ? parseInt(val, 10) : DEFAULT_PAGE))
    .pipe(zod.number().min(1)),
  pageSize: zod
    .string()
    .optional()
    .default(DEFAULT_PAGE_SIZE.toString())
    .transform(val => (val ? parseInt(val, 10) : DEFAULT_PAGE_SIZE))
    .pipe(zod.number().min(1).max(MAX_PAGE_SIZE)),
});

export type PaginationQuery = zod.infer<typeof paginationQueryValidator>;
