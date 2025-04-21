import { createRoute } from '@hono/zod-openapi';
import { Context } from 'hono';
import { z as zod } from 'zod';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import UserController from '../controllers/users.controller';
import { createPaginatedResponseSchema } from '../utils/swagger-response.utils';
import { userSchema } from '../validators/schemas/user.schema';
import { BaseRoutes } from './base.routes';

export class UserRoutes extends BaseRoutes {
  PATH = '/users';

  protected RESOURCE_NAME = 'users';

  constructor(protected readonly userController: UserController) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'post',
          path: '/accept-invitation',
          summary: 'Accept invitation',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(userSchema),
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
        handler: this.userController.acceptInvitation,
        validations: [
          {
            target: VALIDATION_TARGETS.BODY,
            schema: zod.object({
              invitationId: zod.string(),
            }),
          },
        ],
        middlewares: [],
      },
    ];

    routes.forEach(({ route, handler, validations, middlewares }) => {
      this.registerRoute(
        route,
        handler as (ctx: Context) => Promise<Response>,
        {
          validations,
          middlewares,
        },
      );
    });
  }
}
