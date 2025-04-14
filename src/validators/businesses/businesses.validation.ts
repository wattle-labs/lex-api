import {
  createPathParamValidator,
  mergeValidators,
  paginationQueryValidator,
  sortingQueryValidator,
} from '../index';

export const businessFindAllQueryValidator = mergeValidators(
  paginationQueryValidator,
  sortingQueryValidator,
);

export const businessIdPathParamValidator = createPathParamValidator(
  'id',
  'Business ID is required',
);

export const businessSlugPathParamValidator = createPathParamValidator(
  'slug',
  'Business slug is required',
);
