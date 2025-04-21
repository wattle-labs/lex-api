import { createPathParamValidator } from './index';

export const userIdPathParamValidator = createPathParamValidator(
  'userId',
  'User ID is required',
);
