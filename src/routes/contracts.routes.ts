import { createRoute, z } from '@hono/zod-openapi';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import ContractController from '../controllers/contracts.controller';
import { contractsMiddleware } from '../middlewares/resources/contracts.middleware';
import {
  ErrorResponseSchema,
  createPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import {
  contractFindAllQueryValidator,
  contractIdPathParamValidator,
} from '../validators/contracts/contracts.validation';
import { contractSchema } from '../validators/schemas/contract.schema';
import { BaseRoutes } from './base.routes';

export class ContractRoutes extends BaseRoutes {
  PATH = '/contracts';

  protected RESOURCE_NAME = 'contracts';

  constructor(protected readonly contractController: ContractController) {
    super();
    this.router.use(contractsMiddleware);
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/',
          summary: 'Get all contracts',
          tags: [this.RESOURCE_NAME],
          request: {
            query: contractFindAllQueryValidator.openapi('Query parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(contractSchema),
                },
              },
            },
            '404': {
              description: 'Contracts not found',
              content: {},
            },
            '500': {
              description: 'Internal server error',
              content: {},
            },
          },
        }),
        handler: this.contractController.findAll,
        validations: [
          {
            target: VALIDATION_TARGETS.QUERY,
            schema: contractFindAllQueryValidator,
          },
        ],
      },
      {
        route: createRoute({
          method: 'get',
          path: '/:id',
          summary: 'Get contract by ID',
          tags: [this.RESOURCE_NAME],
          request: {
            params: contractIdPathParamValidator.openapi('Path parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(contractSchema),
                },
              },
            },
            '404': {
              description: 'Contract not found',
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
        handler: this.contractController.findById,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: contractIdPathParamValidator,
          },
        ],
      },
      {
        route: createRoute({
          method: 'delete',
          path: '/:id',
          summary: 'Delete contract by ID',
          tags: [this.RESOURCE_NAME],
          request: {
            params: contractIdPathParamValidator.openapi('Path parameters'),
          },
          responses: {
            '204': {
              description: 'Successful response',
              content: {},
            },
            '404': {
              description: 'Contract not found',
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
        handler: this.contractController.delete,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: contractIdPathParamValidator,
          },
        ],
      },
      {
        route: createRoute({
          method: 'get',
          path: '/statistics',
          summary: 'Get dashboard statistics',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(
                    z.object({
                      countByStatus: z.array(
                        z.object({
                          _id: z.string(),
                          count: z.number().default(0),
                        }),
                      ),
                      countOfParties: z.number().default(0),
                    }),
                  ),
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {},
            },
          },
        }),
        handler: this.contractController.getDashboardStatistics,
        validations: [],
      },
    ];

    routes.forEach(({ route, handler, validations }) => {
      this.registerRoute(route, handler, { validations });
    });
  }
}
