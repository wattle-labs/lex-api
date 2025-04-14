import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

import { logger } from './lib/logger';
import { mongoService } from './lib/mongo';

dotenv.config();

const PORT = process.env.PORT || 8080;

(async () => {
  logger.initialize(
    process.env.SERVICE_ID || 'lex-api',
    process.env.API_LOG_LEVEL || 'debug',
    process.env.API_LOG_COLORIZE === 'false' ? false : true,
  );

  logger.info('Initializing MongoDB');
  await mongoService.initialize({
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGO_DB_NAME || 'lex-db',
    options: {
      appName: process.env.MONGO_APP_NAME,
      replicaSet: process.env.MONGO_REPLICA_SET || undefined,
    },
  });

  const { app } = await import('./app');

  serve({
    fetch: app.fetch,
    port: Number(PORT),
  });

  logger.info(`Server is running on port ${PORT}`);
})();
