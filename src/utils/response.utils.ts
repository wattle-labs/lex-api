import { ApiResponse } from '../types/api.types';

export const successResponse = <T>(
  data: T,
  statusCode = 200,
): ApiResponse<T> => ({
  success: true,
  data,
  statusCode,
});

export const errorResponse = (
  error: string,
  statusCode = 400,
): ApiResponse<never> => ({
  success: false,
  error,
  statusCode,
});
