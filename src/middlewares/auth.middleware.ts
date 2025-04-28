import { verifyToken } from '@clerk/express';
import dotenv from 'dotenv';
import { Context, Next } from 'hono';

import { SKIP_AUTH_PATHS } from '../config/auth.config';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { usersService } from '../services/users.service';

dotenv.config();

const unauthorizedResponse = ResponseBuilder.unauthorized('Unauthorized');

export const authMiddleware = async (ctx: Context, next: Next) => {
  try {
    if (SKIP_AUTH_PATHS.includes(ctx.req.path)) {
      await next();
      return;
    }

    const authHeader = ctx.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.json(unauthorizedResponse, 401);
    }

    const token = authHeader.split(' ')[1];
    const { sub: userId } = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!userId) {
      return ctx.json(unauthorizedResponse, 401);
    }

    const user = await usersService.findByExternalId(userId);

    if (!user) {
      return ctx.json(unauthorizedResponse, 401);
    }

    ctx.set('user', user);
    await next();
  } catch (error) {
    logger.error(
      'Error in auth middleware',
      {
        error: error instanceof Error ? error.message : error,
      },
      error as Error,
    );
    return ctx.json(unauthorizedResponse, 401);
  }
};
