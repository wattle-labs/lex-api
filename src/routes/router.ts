import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { version as releaseVersion } from '../../package.json';
import { API_BASE_PATH } from '../constants/api.constants';
import BusinessController from '../controllers/businesses.controller';
import ContractTypeController from '../controllers/contractTypes.controller';
import ContractController from '../controllers/contracts.controller';
import { IngestController } from '../controllers/ingest.controller';
import PartyController from '../controllers/parties.controller';
import UserController from '../controllers/users.controller';
import UsersController from '../controllers/users.controller';
import ViewsController from '../controllers/views.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { businessService } from '../services/businesses.service';
import { contractTypeService } from '../services/contractTypes.service';
import { contractService } from '../services/contracts.service';
import { ingestService } from '../services/ingest.service';
import { partyService } from '../services/parties.service';
import { usersService } from '../services/users.service';
import { viewsService } from '../services/views.service';
import { BusinessRoutes } from './businesses.routes';
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
  new ContractController(contractService),
);

const userRoutes = new UserRoutes(new UserController(usersService));
const ingestRoutes = new IngestRoutes(new IngestController(ingestService));

const contractTypeRoutes = new ContractTypeRoutes(
  new ContractTypeController(contractTypeService),
);

const partyRoutes = new PartyRoutes(new PartyController(partyService));

const viewsRoutes = new ViewsRoutes(new ViewsController(viewsService));

const usersRoutes = new UsersRoutes(new UsersController(userService));

router.route(businessRoutes.PATH, businessRoutes.getRouter());
router.route(contractRoutes.PATH, contractRoutes.getRouter());
router.route(contractTypeRoutes.PATH, contractTypeRoutes.getRouter());
router.route(ingestRoutes.PATH, ingestRoutes.getRouter());
router.route(partyRoutes.PATH, partyRoutes.getRouter());
router.route(viewsRoutes.PATH, viewsRoutes.getRouter());
router.route(usersRoutes.PATH, usersRoutes.getRouter());

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
