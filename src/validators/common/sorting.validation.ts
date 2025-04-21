import { z as zod } from 'zod';

import { QUERY_CONFIG } from '../../config/api.config';
import { SORT_ORDER } from '../../constants/request.constants';
import { SortOrderType } from '../../types/pagination.types';

const { ASC, DESC } = SORT_ORDER;

export const sortOrderValidator = zod
  .enum([ASC, DESC])
  .default(QUERY_CONFIG.DEFAULT_SORT_ORDER as SortOrderType);

export const sortingQueryValidator = zod.object({
  sortBy: zod.string().optional(),
  sortOrder: sortOrderValidator.optional(),
});

export type SortingQuery = zod.infer<typeof sortingQueryValidator>;
