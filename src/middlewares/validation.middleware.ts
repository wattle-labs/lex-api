import { Context, Next } from 'hono';
import { z } from 'zod';

import {
  VALIDATION_MIDDLEWARE_KEY,
  VALIDATION_TARGETS,
} from '../constants/validation.constants';
import { ValidationError } from '../lib/errors.handler';
import { ValidationOptions, ValidationTarget } from '../types/routing.types';

const getDataForTarget = (ctx: Context, target: ValidationTarget) => {
  switch (target) {
    case VALIDATION_TARGETS.PARAMS:
      return ctx.req.param();
    case VALIDATION_TARGETS.QUERY:
      return ctx.req.query();
    case VALIDATION_TARGETS.BODY:
      return ctx.req.json();
    case VALIDATION_TARGETS.HEADERS:
      return ctx.req.header();
    default:
      return {};
  }
};

export const validate = (validations: ValidationOptions[]) => {
  return async (ctx: Context, next: Next) => {
    try {
      for (const { target, schema } of validations) {
        const data = await getDataForTarget(ctx, target);
        const validatedData = await schema.parseAsync(data);

        ctx.set(`${VALIDATION_MIDDLEWARE_KEY}:${target}`, validatedData);
      }
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        const mainError = details[0];
        const fieldName = mainError?.path || 'unknown field';
        let errorMessage = `Validation failed: ${fieldName} - ${mainError?.message}`;

        if (details.length > 1) {
          errorMessage += ` (and ${details.length - 1} more validation errors)`;
        }

        throw new ValidationError(errorMessage, { errors: details });
      }
      throw error;
    }
  };
};
