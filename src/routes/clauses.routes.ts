import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import ClauseDefinitionController from '../controllers/clauseDefinitions.controller';
// import { VALIDATION_TARGETS } from '../constants/validation.constants';
import ClauseController from '../controllers/clauses.controller';
import {
  ErrorResponseSchema,
  createPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import { clauseSchema } from '../validators/schemas/clause.schema';
import { clauseDefinitionSchema } from '../validators/schemas/clauseDefinition.schema';
import { BaseRoutes } from './base.routes';

/**
 * This set of routes handles both:
 * - Clauses (instances of clauses)
 * - Clause definitions
 *
 * As a result, it is initialized with two controllers
 */
export class ClauseRoutes extends BaseRoutes {
  PATH = '/clauses';

  protected RESOURCE_NAME = 'clauses';

  constructor(
    protected readonly clauseController: ClauseController,
    protected readonly clauseDefinitionController: ClauseDefinitionController,
  ) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const clauseDefinitionRoutes = [
      {
        route: createRoute({
          method: 'get',
          path: '/definitions',
          summary: 'Get all clause definitions',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(clauseDefinitionSchema),
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
        handler: this.clauseDefinitionController.findAll,
        validations: [],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/definitions',
          summary: 'Create clause definition',
          tags: [this.RESOURCE_NAME],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: clauseDefinitionSchema,
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(z.object({})),
                },
              },
            },
            '400': {
              description: 'Bad request',
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
        handler: this.clauseDefinitionController.create,
        validations: [
          {
            target: VALIDATION_TARGETS.BODY,
            schema: clauseDefinitionSchema,
          },
        ],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/definitions/initialize',
          summary: 'Initialize clause definitions',
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
        handler: this.clauseDefinitionController.initialize,
        validations: [],
      },
    ];

    const clauseRoutes = [
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
          path: '/',
          summary: 'Create new clause',
          tags: [this.RESOURCE_NAME],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: clauseSchema,
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(z.object({})),
                },
              },
            },
            '400': {
              description: 'Bad request',
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
        handler: this.clauseController.create,
        validations: [
          {
            target: VALIDATION_TARGETS.BODY,
            schema: clauseSchema,
          },
        ],
      },
    ];

    clauseDefinitionRoutes.forEach(({ route, handler, validations }) => {
      this.registerRoute(route, handler, { validations });
    });

    clauseRoutes.forEach(({ route, handler, validations }) => {
      this.registerRoute(route, handler, { validations });
    });
  }
}
