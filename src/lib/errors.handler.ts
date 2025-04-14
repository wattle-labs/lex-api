export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public validationDetails?: {
      errors?: Array<{ path: string; message: string; code: string }>;
    },
  ) {
    super(400, message, 'VALIDATION_ERROR', validationDetails);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string) {
    super(
      404,
      id ? `${resource} with ID ${id} not found` : `${resource} not found`,
      'RESOURCE_NOT_FOUND',
    );
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message, 'INTERNAL_SERVER_ERROR');
  }
}
