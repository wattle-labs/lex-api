import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { version as releaseVersion } from '../../package.json';
import { API_BASE_PATH } from '../constants/api.constants';
import { BlobStoreController } from '../controllers/blobStore.controller';
import BusinessController from '../controllers/businesses.controller';
import ContractController from '../controllers/contracts.controller';
import UserController from '../controllers/users.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { blobStoreService } from '../services/blobStore.service';
import { businessService } from '../services/businesses.service';
import { contractsService } from '../services/contracts.service';
import { usersService } from '../services/users.service';
import { BlobStoreRoutes } from './blobStore.routes';
import { BusinessRoutes } from './businesses.routes';
import { ContractRoutes } from './contracts.routes';
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
const blobStoreRoutes = new BlobStoreRoutes(
  new BlobStoreController(blobStoreService),
);

router.route(businessRoutes.PATH, businessRoutes.getRouter());
router.route(contractRoutes.PATH, contractRoutes.getRouter());
router.route(blobStoreRoutes.PATH, blobStoreRoutes.getRouter());

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
