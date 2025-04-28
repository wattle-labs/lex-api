import { createPathParamValidator } from '../index';

export const userIdPathParamValidator = createPathParamValidator(
  'id',
  'ID is required',
);
