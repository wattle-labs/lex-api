import { ApiResponse } from '../types/api.response';

export class ResponseBuilder {
  static success<T>(
    data: T,
    message?: string,
    statusCode = 200,
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      statusCode,
    };
  }

  static error(
    message: string,
    code?: string,
    statusCode = 400,
  ): ApiResponse<null> {
    let numericStatusCode = statusCode;
    if (code && /^\d+$/.test(code)) {
      numericStatusCode = parseInt(code, 10);
    }

    return {
      success: false,
      error: code,
      message,
      statusCode: numericStatusCode,
    };
  }

  static created<T>(data: T, message = 'Created successfully'): ApiResponse<T> {
    return this.success(data, message, 201);
  }

  static updated<T>(data: T, message = 'Updated successfully'): ApiResponse<T> {
    return this.success(data, message, 200);
  }

  static deleted(message = 'Deleted successfully'): ApiResponse<null> {
    return this.success(null, message, 200);
  }

  static notFound(message: string): ApiResponse<null> {
    return this.error(message, '404', 404);
  }

  static badRequest(message: string): ApiResponse<null> {
    return this.error(message, '400', 400);
  }

  static unauthorized(message: string): ApiResponse<null> {
    return this.error(message, '401', 401);
  }

  static forbidden(message: string): ApiResponse<null> {
    return this.error(message, '403', 403);
  }

  static serverError(message: string): ApiResponse<null> {
    return this.error(message, '500', 500);
  }
}
