import {
  createPathParamValidator,
  mergeValidators,
  paginationQueryValidator,
  sortingQueryValidator,
} from '../index';

export const contractFindAllQueryValidator = mergeValidators(
  paginationQueryValidator,
  sortingQueryValidator,
);

export const contractIdPathParamValidator = createPathParamValidator(
  'id',
  'Contract ID is required',
);
