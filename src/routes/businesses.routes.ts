import { createRoute } from '@hono/zod-openapi';
import { Context } from 'hono';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import BusinessController from '../controllers/businesses.controller';
import { businessesMiddleware } from '../middlewares/resources/businesses.middleware';
import {
  ErrorResponseSchema,
  createPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import {
  businessFindAllQueryValidator,
  businessIdPathParamValidator,
  businessSlugPathParamValidator,
} from '../validators/businesses/businesses.validation';
import { businessSchema } from '../validators/schemas/business.schema';
import { BaseRoutes } from './base.routes';

const businessCreateBodyValidator = businessSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export class BusinessRoutes extends BaseRoutes {
  PATH = '/businesses';

  protected RESOURCE_NAME = 'businesses';

  constructor(protected readonly businessController: BusinessController) {
    super();
    this.router.use(businessesMiddleware);
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/',
          summary: 'Get all businesses',
          tags: [this.RESOURCE_NAME],
          request: {
            query: businessFindAllQueryValidator.openapi('Query parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(businessSchema),
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
            '406': {
              description: 'Not acceptable',
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
        handler: this.businessController.findAll,
        validations: [
          {
            target: VALIDATION_TARGETS.QUERY,
            schema: businessFindAllQueryValidator,
          },
        ],
      },
      {
        route: createRoute({
          method: 'get',
          path: '/:id',
          summary: 'Get business by ID',
          tags: [this.RESOURCE_NAME],
          request: {
            params: businessIdPathParamValidator.openapi('Path parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(businessSchema),
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
        handler: this.businessController.findById,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: businessIdPathParamValidator,
          },
        ],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/',
          summary: 'Create a new business',
          tags: [this.RESOURCE_NAME],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: businessCreateBodyValidator,
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Created',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(businessSchema),
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
        handler: this.businessController.create,
        validations: [
          {
            target: VALIDATION_TARGETS.BODY,
            schema: businessCreateBodyValidator,
          },
        ],
      },
      {
        route: createRoute({
          method: 'get',
          path: '/slug/:slug',
          summary: 'Get business by slug',
          tags: [this.RESOURCE_NAME],
          request: {
            params: businessSlugPathParamValidator.openapi('Path parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(businessSchema),
                },
              },
            },
            '404': {
              description: 'Business not found',
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
        handler: this.businessController.findBySlug,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: businessSlugPathParamValidator,
          },
        ],
      },
    ];

    routes.forEach(({ route, handler, validations }) => {
      this.registerRoute(
        route,
        handler as (ctx: Context) => Promise<Response>,
        {
          validations,
        },
      );
    });
  }
}

export const createBusinessRoutes = (
  businessController: BusinessController,
): BusinessRoutes => {
  return new BusinessRoutes(businessController);
};
