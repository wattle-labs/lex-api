import {
  createPathParamValidator,
  mergeValidators,
  paginationQueryValidator,
  sortingQueryValidator,
} from '../index';

export const partySearchQueryValidator = mergeValidators(
  paginationQueryValidator,
  sortingQueryValidator,
);

export const partyNamePathParamValidator = createPathParamValidator(
  'name',
  'Party name is required',
);
