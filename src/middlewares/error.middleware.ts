import {
  ApiError,
  InternalServerError,
  ValidationError,
} from '../lib/errors.handler';
import { ResponseBuilder } from '../lib/response.handler';

export const errorMiddleware = async (err, c) => {
  if (err instanceof ValidationError) {
    const response = ResponseBuilder.error(
      err.message,
      err.code,
      err.statusCode,
    );

    if (err.validationDetails?.errors) {
      response.validationErrors = err.validationDetails.errors;
    }

    return c.json(response, response.statusCode || err.statusCode);
  } else if (err instanceof ApiError) {
    const response = ResponseBuilder.error(
      err.message,
      err.code,
      err.statusCode,
    );

    return c.json(response, response.statusCode || err.statusCode);
  }

  const unexpectedError = new InternalServerError(
    process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message,
  );

  const response = ResponseBuilder.serverError(unexpectedError.message);

  return c.json(response, response.statusCode || unexpectedError.statusCode);
};
