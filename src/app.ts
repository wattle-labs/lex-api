import dotenv from 'dotenv';
import { Hono } from 'hono';

import { SKIP_LOG_PATHS } from './config/logger.config';
import { API_BASE_PATH } from './constants/api.constants';
import { logger } from './lib/logger';
import { corsMiddleware } from './middlewares/cors.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import router from './routes/router';
import { healthCheck } from './utils/health-response.utils';

dotenv.config();

const app = new Hono();

app.use(
  logger.middleware({ skip: ctx => SKIP_LOG_PATHS.includes(ctx.req.path) }),
);
app.use(corsMiddleware);

app.get('/', ctx => ctx.redirect('/health'));
app.get('/ping', ctx => ctx.json({ status: 'pong' }));
app.get('/health', healthCheck);

app.route(API_BASE_PATH, router);

app.onError(errorMiddleware);

export { app };
