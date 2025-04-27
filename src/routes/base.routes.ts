import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { Context, Next } from 'hono';

import { validate } from '../middlewares/validation.middleware';
import { ValidationOptions } from '../types/routing.types';

export abstract class BaseRoutes {
  protected router: OpenAPIHono;

  protected abstract PATH: string;

  protected abstract RESOURCE_NAME: string;

  constructor() {
    this.router = new OpenAPIHono();
  }

  protected abstract setupRoutes(): void;

  public getRouter(): OpenAPIHono {
    return this.router;
  }

  protected registerRoute(
    route: ReturnType<typeof createRoute>,
    handler: (ctx: Context) => Promise<Response>,
    options?: {
      allowedContentTypes?: string[];
      validations?: ValidationOptions[];
      middlewares?: ((ctx: Context, next: Next) => Promise<Response | void>)[];
    },
  ) {
    if (options?.validations) {
      const validationMiddleware = validate(options.validations);
      // Apply validation middleware with method check
      this.router.use(route.path, async (ctx, next) => {
        if (ctx.req.method.toUpperCase() === route.method.toUpperCase()) {
          return await validationMiddleware(ctx, next);
        }
        return await next();
      });
    }

    if (options?.middlewares) {
      options.middlewares.forEach(middleware => {
        // Apply each middleware with method check
        this.router.use(route.path, async (ctx, next) => {
          if (ctx.req.method.toUpperCase() === route.method.toUpperCase()) {
            return await middleware(ctx, next);
          }
          return await next();
        });
      });
    }

    this.router.openapi(route, async ctx => {
      return await handler(ctx);
    });
  }
}
