import { Context } from 'hono';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import { VALIDATION_MIDDLEWARE_KEY } from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { MongooseModel } from '../models/interfaces/document';
import { User } from '../models/interfaces/user';
import { UserService } from '../services/users.service';
import { BaseController } from './base.controller';

class UsersController extends BaseController<MongooseModel<User>, UserService> {
  constructor(service: UserService) {
    super(service, 'user');
  }

  getUserByClerkId = async (ctx: Context): Promise<Response> => {
    const { id } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    try {
      logger.info(`Finding user by clerkId: ${id}`);
      const user = await this.service.findByClerkId(id);
      return ctx.json(ResponseBuilder.success(user), 200);
    } catch (error) {
      logger.error(
        'Failed to find user by clerkId',
        { id },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to find user by clerkId';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };

  getUserByEmail = async (ctx: Context): Promise<Response> => {
    const { email } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.QUERY}`,
    );

    try {
      logger.info(`Finding user by email: ${email}`);
      const user = await this.service.findByEmail(email);
      return ctx.json(ResponseBuilder.success(user), 200);
    } catch (error) {
      logger.error(
        'Failed to find user by email',
        { email },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error ? error.message : 'Failed to find user by email';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };
}

export default UsersController;
