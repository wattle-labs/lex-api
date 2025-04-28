import { createRoute } from '@hono/zod-openapi';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import UsersController from '../controllers/users.controller';
import {
  ErrorResponseSchema,
  // createPaginatedResponseSchema,
  // createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import { userSchema } from '../validators/schemas/user.schema';
import { userIdPathParamValidator } from '../validators/users/users.validation';
import { BaseRoutes } from './base.routes';

export class UsersRoutes extends BaseRoutes {
  PATH = '/users';

  protected RESOURCE_NAME = 'users';

  constructor(protected readonly usersController: UsersController) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/:id',
          summary: 'Get user by ID',
          tags: [this.RESOURCE_NAME],
          request: {
            params: userIdPathParamValidator,
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: userSchema,
                },
              },
            },
            '404': {
              description: 'User not found',
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
        handler: this.usersController.getUserByClerkId,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: userIdPathParamValidator,
          },
        ],
      },
    ];

    routes.forEach(({ route, handler, validations }) => {
      this.registerRoute(route, handler, { validations });
    });
  }
}
