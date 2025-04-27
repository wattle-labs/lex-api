import { clerkClient, verifyToken } from '@clerk/express';
import { Context } from 'hono';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import { VALIDATION_MIDDLEWARE_KEY } from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { UsersService } from '../services/users.service';

class UserController {
  constructor(private readonly service: UsersService) {}

  acceptInvitation = async (c: Context): Promise<Response> => {
    try {
      const authHeader = c.req.header('Authorization');

      if (!authHeader) {
        return c.json(ResponseBuilder.error('Unauthorized'), 401);
      }

      const token = authHeader.split(' ')[1];

      const { sub: externalUserId } = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      const clerkUser = await clerkClient.users.getUser(externalUserId);

      if (!clerkUser) {
        return c.json(ResponseBuilder.error('Unauthorized'), 401);
      }

      const { invitationId } = c.get(
        `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.BODY}`,
      );

      const user = await this.service.acceptInvitation(invitationId, clerkUser);

      return c.json(
        ResponseBuilder.success(user, 'Invitation accepted', 200),
        200,
      );
    } catch (error: unknown) {
      logger.error(
        'Error accepting invitation',
        {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        error instanceof Error ? error : undefined,
      );
      return c.json(ResponseBuilder.error('Internal Server Error'), 500);
    }
  };
}

export default UserController;
