import { Context } from 'hono';

import { version as releaseVersion } from '../../package.json';

export const healthCheck = (ctx: Context) => {
  return ctx.json({
    status: 'ok',
    version: releaseVersion,
    environment: process.env.NODE_ENV || 'development',
  });
};
