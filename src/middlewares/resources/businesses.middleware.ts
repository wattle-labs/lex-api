import { Context, Next } from 'hono';

import { logger } from '../../lib/logger';

export const businessesMiddleware = async (_ctx: Context, next: Next) => {
  logger.info('Businesses middleware executed');

  await next();
};
