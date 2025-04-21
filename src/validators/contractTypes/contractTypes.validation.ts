import {
  createPathParamValidator,
  mergeValidators,
  paginationQueryValidator,
  sortingQueryValidator,
} from '../index';

export const contractTypeFindAllQueryValidator = mergeValidators(
  paginationQueryValidator,
  sortingQueryValidator,
);

export const contractTypeIdPathParamValidator = createPathParamValidator(
  'id',
  'Contract Type ID is required',
);

export const contractTypeShortNamePathParamValidator = createPathParamValidator(
  'shortName',
  'Contract Type Short Name is required',
);
