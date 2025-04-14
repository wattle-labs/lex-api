import { createRoute } from '@hono/zod-openapi';
import { Context } from 'hono';
import { ZodSchema } from 'zod';

export type ValidationTarget = 'params' | 'query' | 'body' | 'headers';

export type ValidationOptions = {
  target: ValidationTarget;
  schema: ZodSchema;
};

export type RouteType = {
  route: ReturnType<typeof createRoute>;
  handler: (ctx: Context) => Promise<Response>;
  allowedContentTypes?: string[];
  validations?: ValidationOptions[];
};
