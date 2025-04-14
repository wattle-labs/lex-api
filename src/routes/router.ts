import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { version as releaseVersion } from '../../package.json';
import { API_BASE_PATH } from '../constants/api.constants';
import BusinessController from '../controllers/businesses.controller';
import ContractController from '../controllers/contracts.controller';
import { businessService } from '../services/businesses.service';
import { contractsService } from '../services/contracts.service';
import { BusinessRoutes } from './businesses.routes';
import { ContractRoutes } from './contracts.routes';

const router = new OpenAPIHono();

// Docs
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

// Register all routes

const businessRoutes = new BusinessRoutes(
  new BusinessController(businessService),
);

const contractRoutes = new ContractRoutes(
  new ContractController(contractsService),
);

router.route(businessRoutes.PATH, businessRoutes.getRouter());
router.route(contractRoutes.PATH, contractRoutes.getRouter());

// Register health check

router.get('/health', c => {
  return c.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default router;
