import { createRoute } from '@hono/zod-openapi';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import ViewsController from '../controllers/views.controller';
import {
  ErrorResponseSchema,
  createPaginatedResponseSchema,
  // createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import { contractSchema } from '../validators/schemas/contract.schema';
import { viewIdPathParamValidator } from '../validators/views/views.validation';
import { BaseRoutes } from './base.routes';

export class ViewsRoutes extends BaseRoutes {
  PATH = '/views';

  protected RESOURCE_NAME = 'views';

  constructor(protected readonly viewsController: ViewsController) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/:id',
          summary: 'Get contracts for a view',
          tags: [this.RESOURCE_NAME],
          request: {
            params: viewIdPathParamValidator,
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  // @TODO: Need to include obligations as well
                  schema: createPaginatedResponseSchema(contractSchema),
                },
              },
            },
            '404': {
              description: 'View not found',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.viewsController.getContractsForView,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: viewIdPathParamValidator,
          },
        ],
      },
    ];

    routes.forEach(({ route, handler, validations }) => {
      this.registerRoute(route, handler, { validations });
    });
  }
}
