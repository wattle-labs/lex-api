import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// import { VALIDATION_TARGETS } from '../constants/validation.constants';
import ClauseController from '../controllers/clauses.controller';
import {
  ErrorResponseSchema,
  createPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import { clauseSchema } from '../validators/schemas/clause.schema';
import { BaseRoutes } from './base.routes';

export class ClauseRoutes extends BaseRoutes {
  PATH = '/clauses';

  protected RESOURCE_NAME = 'clauses';

  constructor(protected readonly clauseController: ClauseController) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/',
          summary: 'Get all clauses',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(clauseSchema),
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
        handler: this.clauseController.findAll,
        validations: [],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/initialize',
          summary: 'Initialize clauses',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(z.object({})),
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
        handler: this.clauseController.initialize,
        validations: [],
      },
    ];

    routes.forEach(({ route, handler, validations }) => {
      this.registerRoute(route, handler, { validations });
    });
  }
}
