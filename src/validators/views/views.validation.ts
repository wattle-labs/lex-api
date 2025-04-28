import {
  createPathParamValidator,
  mergeValidators,
  paginationQueryValidator,
  sortingQueryValidator,
} from '../index';

export const viewSearchQueryValidator = mergeValidators(
  paginationQueryValidator,
  sortingQueryValidator,
);

export const viewIdPathParamValidator = createPathParamValidator(
  'id',
  'View ID is required',
);
