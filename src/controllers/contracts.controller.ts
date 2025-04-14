import { Context } from 'hono';

import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ContractsService } from '../services/contracts.service';
import { BaseController } from './base.controller';

class ContractController extends BaseController<
  MongooseModel<Contract>,
  ContractsService
> {
  constructor(service: ContractsService) {
    super(service, 'contract');
  }

  findByBusinessId = async (c: Context): Promise<Response> => {
    try {
      const businessId = c.req.param('businessId');
      const contract = await this.service.findByBusinessId(businessId);
      return c.json(ResponseBuilder.success(contract), 200);
    } catch (error) {
      logger.error(
        'Failed to find businesses by slug',
        { businessId: c.req.param('businessId') },
        error instanceof Error ? error : new Error(String(error)),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to find businesses by slug';

      return c.json(ResponseBuilder.badRequest(message), 400);
    }
  };
}

export default ContractController;
