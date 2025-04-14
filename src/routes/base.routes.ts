import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { Context } from 'hono';

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
    },
  ) {
    if (options?.validations) {
      this.router.use(route.path, validate(options.validations));
    }

    this.router.openapi(route, async ctx => {
      return await handler(ctx);
    });
  }
}
