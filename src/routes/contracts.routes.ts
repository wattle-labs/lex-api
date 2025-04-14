import { createRoute } from '@hono/zod-openapi';

import ContractController from '../controllers/contracts.controller';
import { contractsMiddleware } from '../middlewares/resources/contracts.middleware';
import { BaseRoutes } from './base.routes';

export class ContractRoutes extends BaseRoutes {
  PATH = '/contracts';

  protected RESOURCE_NAME = 'contracts';

  constructor(protected readonly contractController: ContractController) {
    super();
    this.router.use(contractsMiddleware);
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/',
          summary: 'Get all contracts',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {},
            },
            '404': {
              description: 'Contracts not found',
              content: {},
            },
            '500': {
              description: 'Internal server error',
              content: {},
            },
          },
        }),
        handler: this.contractController.findAll,
      },
      {
        route: createRoute({
          method: 'get',
          path: '/:id',
          summary: 'Get contract by ID',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {},
            },
            '404': {
              description: 'Contract not found',
              content: {},
            },
            '500': {
              description: 'Internal server error',
              content: {},
            },
          },
        }),
        handler: this.contractController.findById,
      },
    ];

    routes.forEach(({ route, handler }) => {
      this.registerRoute(route, handler);
    });
  }
}
