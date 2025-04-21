import { createRoute } from '@hono/zod-openapi';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import ContractTypeController from '../controllers/contractTypes.controller';
import {
  ErrorResponseSchema,
  createPaginatedResponseSchema,
  // createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import { contractTypeFindAllQueryValidator } from '../validators/contractTypes/contractTypes.validation';
import { contractTypeSchema } from '../validators/schemas/contractType.schema';
import { BaseRoutes } from './base.routes';

export class ContractTypeRoutes extends BaseRoutes {
  PATH = '/contract-types';

  protected RESOURCE_NAME = 'contract-types';

  constructor(
    protected readonly contractTypeController: ContractTypeController,
  ) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/',
          summary: 'Get all contract types',
          tags: [this.RESOURCE_NAME],
          request: {
            query:
              contractTypeFindAllQueryValidator.openapi('Query parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(contractTypeSchema),
                },
              },
            },
            '404': {
              description: 'Contracts not found',
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
        validations: [
          {
            target: VALIDATION_TARGETS.QUERY,
            schema: contractTypeFindAllQueryValidator,
          },
        ],
        handler: this.contractTypeController.findAll,
      },
    ];

    routes.forEach(({ route, handler, validations }) => {
      this.registerRoute(route, handler, { validations });
    });
  }
}
