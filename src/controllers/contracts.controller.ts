import { Context } from 'hono';

import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { ContractService } from '../services/contracts.service';

class ContractController {
  constructor(private readonly service: ContractService) {}

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
