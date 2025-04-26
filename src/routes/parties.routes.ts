import { createRoute } from '@hono/zod-openapi';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import PartyController from '../controllers/parties.controller';
import {
  ErrorResponseSchema,
  createPaginatedResponseSchema,
  // createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import { partySchema } from '../validators/schemas/party.schema';
import { BaseRoutes } from './base.routes';

const partySearchBodyValidator = partySchema.pick({ name: true });

export class PartyRoutes extends BaseRoutes {
  PATH = '/parties';

  protected RESOURCE_NAME = 'parties';

  constructor(protected readonly partyController: PartyController) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'post',
          path: '/search',
          summary: 'Search parties by name',
          tags: [this.RESOURCE_NAME],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: partySearchBodyValidator,
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(partySchema),
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
        handler: this.partyController.findByName,
        validations: [
          {
            target: VALIDATION_TARGETS.BODY,
            schema: partySearchBodyValidator,
          },
        ],
      },
    ];

    routes.forEach(({ route, handler, validations }) => {
      this.registerRoute(route, handler, { validations });
    });
  }
}
