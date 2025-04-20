import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { version as releaseVersion } from '../../package.json';
import { API_BASE_PATH } from '../constants/api.constants';
import BusinessController from '../controllers/businesses.controller';
import ContractController from '../controllers/contracts.controller';
import { IngestController } from '../controllers/ingest.controller';
import UserController from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { businessService } from '../services/businesses.service';
import { contractsService } from '../services/contracts.service';
import { ingestService } from '../services/ingest.service';
import { usersService } from '../services/users.service';
import { BusinessRoutes } from './businesses.routes';
import { ContractRoutes } from './contracts.routes';
import { IngestRoutes } from './ingest.routes';
import { UserRoutes } from './users.routes';

const router = new OpenAPIHono();
const protectedRouter = new OpenAPIHono();

protectedRouter.use('*', authMiddleware);

router.get('/docs/spec', c => {
  return c.json(
    router.getOpenAPIDocument({
      openapi: '3.0.0',
      info: {
        title: 'Lex API',
        version: releaseVersion,
      },
    }),
  );
});

router.get('/docs/ui', swaggerUI({ url: `${API_BASE_PATH}/docs/spec` }));

const businessRoutes = new BusinessRoutes(
  new BusinessController(businessService),
);

const contractRoutes = new ContractRoutes(
  new ContractController(contractsService),
);

const userRoutes = new UserRoutes(new UserController(usersService));
const ingestRoutes = new IngestRoutes(new IngestController(ingestService));

router.route(businessRoutes.PATH, businessRoutes.getRouter());
router.route(contractRoutes.PATH, contractRoutes.getRouter());
router.route(ingestRoutes.PATH, ingestRoutes.getRouter());

protectedRouter.route(businessRoutes.PATH, businessRoutes.getRouter());
protectedRouter.route(contractRoutes.PATH, contractRoutes.getRouter());
protectedRouter.route(userRoutes.PATH, userRoutes.getRouter());

router.route('/', protectedRouter);

router.get('/health', c => {
  return c.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default router;
