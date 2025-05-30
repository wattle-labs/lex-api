import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { version as releaseVersion } from '../../package.json';
import { API_BASE_PATH } from '../constants/api.constants';
import BusinessController from '../controllers/businesses.controller';
import ClauseDefinitionController from '../controllers/clauseDefinitions.controller';
import ClauseController from '../controllers/clauses.controller';
import ContractTypeController from '../controllers/contractTypes.controller';
import { contractController } from '../controllers/contracts.controller';
import { IngestController } from '../controllers/ingest.controller';
import PartyController from '../controllers/parties.controller';
import UserController from '../controllers/users.controller';
import ViewsController from '../controllers/views.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { businessService } from '../services/businesses.service';
import { clauseDefinitionService } from '../services/clauseDefinitions.service';
import { clauseService } from '../services/clauses.service';
import { contractTypeService } from '../services/contractTypes.service';
import { ingestService } from '../services/ingest.service';
import { partyService } from '../services/parties.service';
import { usersService } from '../services/users.service';
import { viewsService } from '../services/views.service';
import { BusinessRoutes } from './businesses.routes';
import { ClauseRoutes } from './clauses.routes';
import { ContractTypeRoutes } from './contractTypes.routes';
import { ContractRoutes } from './contracts.routes';
import { IngestRoutes } from './ingest.routes';
import { PartyRoutes } from './parties.routes';
import { UserRoutes } from './users.routes';
import { ViewsRoutes } from './views.routes';

const router = new OpenAPIHono();
const protectedRouter = new OpenAPIHono();

protectedRouter.use('*', authMiddleware);

router.get('/docs/spec', c => {
  return c.json(
    router.getOpenAPIDocument({
      openapi: '3.0.0',
      info: {
        title: 'Clarus API',
        version: releaseVersion,
      },
    }),
  );
});

router.get('/docs/ui', swaggerUI({ url: `${API_BASE_PATH}/docs/spec` }));

const businessRoutes = new BusinessRoutes(
  new BusinessController(businessService),
);

const contractRoutes = new ContractRoutes(contractController);
const usersRoutes = new UserRoutes(new UserController(usersService));
const ingestRoutes = new IngestRoutes(new IngestController(ingestService));
const contractTypeRoutes = new ContractTypeRoutes(
  new ContractTypeController(contractTypeService),
);
const clauseRoutes = new ClauseRoutes(
  new ClauseController(clauseService),
  new ClauseDefinitionController(clauseDefinitionService),
);
const partyRoutes = new PartyRoutes(new PartyController(partyService));

const viewsRoutes = new ViewsRoutes(new ViewsController(viewsService));

// Protected routes
protectedRouter.route(businessRoutes.PATH, businessRoutes.getRouter());
protectedRouter.route(contractRoutes.PATH, contractRoutes.getRouter());
protectedRouter.route(usersRoutes.PATH, usersRoutes.getRouter());
protectedRouter.route(contractTypeRoutes.PATH, contractTypeRoutes.getRouter());
protectedRouter.route(ingestRoutes.PATH, ingestRoutes.getRouter());
protectedRouter.route(clauseRoutes.PATH, clauseRoutes.getRouter());
protectedRouter.route(partyRoutes.PATH, partyRoutes.getRouter());
protectedRouter.route(viewsRoutes.PATH, viewsRoutes.getRouter());

router.route('/', protectedRouter);
router.get('/health', c => {
  return c.json({
    message: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default router;
