import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { version as releaseVersion } from '../../package.json';
import { API_BASE_PATH } from '../constants/api.constants';
import BusinessController from '../controllers/businesses.controller';
import ContractTypeController from '../controllers/contractTypes.controller';
import ContractController from '../controllers/contracts.controller';
import { IngestController } from '../controllers/ingest.controller';
import { businessService } from '../services/businesses.service';
import { contractTypeService } from '../services/contractTypes.service';
import { contractService } from '../services/contracts.service';
import { ingestService } from '../services/ingest.service';
import { BusinessRoutes } from './businesses.routes';
import { ContractTypeRoutes } from './contractTypes.routes';
import { ContractRoutes } from './contracts.routes';
import { IngestRoutes } from './ingest.routes';

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
  new ContractController(contractService),
);

const ingestRoutes = new IngestRoutes(new IngestController(ingestService));

const contractTypeRoutes = new ContractTypeRoutes(
  new ContractTypeController(contractTypeService),
);

router.route(businessRoutes.PATH, businessRoutes.getRouter());
router.route(contractRoutes.PATH, contractRoutes.getRouter());
router.route(contractTypeRoutes.PATH, contractTypeRoutes.getRouter());
router.route(ingestRoutes.PATH, ingestRoutes.getRouter());

// Register health check
router.get('/health', c => {
  return c.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default router;
