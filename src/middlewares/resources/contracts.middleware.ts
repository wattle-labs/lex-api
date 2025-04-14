import { Context, Next } from 'hono';

import { logger } from '../../lib/logger';

export const contractsMiddleware = async (_ctx: Context, next: Next) => {
  logger.info('Contracts middleware executed');

  await next();
};
