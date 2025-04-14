import { createRoute } from '@hono/zod-openapi';

import { BaseRoutes } from './base.routes';

export class ProxyRoutes extends BaseRoutes {
  PATH = '/proxy';

  protected RESOURCE_NAME = 'proxy';

  constructor() {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/',
          summary: 'Proxy a URL to get around CORS',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {},
            },
            '404': {
              description: 'Business not found',
              content: {},
            },
            '500': {
              description: 'Internal server error',
              content: {},
            },
          },
        }),
        handler: async c => {
          const url = c.req.query('url');
          const response = await fetch(url).then(res => res.blob());
          return c.json({
            success: true,
            data: response,
          });
        },
      },
    ];

    routes.forEach(({ route, handler }) => {
      this.registerRoute(route, handler);
    });
  }
}
