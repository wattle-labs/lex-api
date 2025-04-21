import {
  createPathParamValidator,
  mergeValidators,
  paginationQueryValidator,
  sortingQueryValidator,
} from './index';
import { businessSchema } from './schemas/business.schema';

export const businessFindAllQueryValidator = mergeValidators(
  paginationQueryValidator,
  sortingQueryValidator,
);

export const businessIdPathParamValidator = createPathParamValidator(
  'businessId',
  'Business ID is required',
);

export const businessSlugPathParamValidator = createPathParamValidator(
  'slug',
  'Business slug is required',
);

export const businessCreateBodyValidator = businessSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
