import { Context } from 'hono';

import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import {
  ContractService,
  contractService,
} from '../services/contracts.service';

class ContractController implements Record<string, unknown> {
  [key: string]: unknown;

  constructor(private readonly service: ContractService) {}

  findById = async (ctx: Context): Promise<Response> => {
    try {
      const contract = await this.service.findById(ctx.req.param('id'));
      return ctx.json(ResponseBuilder.success(contract), 200);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error fetching contract';
      logger.error(message, { error });
      return ctx.json(ResponseBuilder.serverError(message), 500);
    }
  };

  findAll = async (ctx: Context): Promise<Response> => {
    try {
      const contracts = await this.service.findAll({});
      return ctx.json(ResponseBuilder.success(contracts), 200);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error fetching contracts';
      logger.error(message, { error });
      return ctx.json(ResponseBuilder.serverError(message), 500);
    }
  };

  delete = async (ctx: Context): Promise<Response> => {
    try {
      await this.service.deleteById(ctx.req.param('id'));
      return ctx.json(ResponseBuilder.deleted());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error deleting contract';
      logger.error(message, { error });
      return ctx.json(ResponseBuilder.serverError(message), 500);
    }
  };

  getDashboardStatistics = async (ctx: Context): Promise<Response> => {
    try {
      const statistics = await this.service.getDashboardStatistics();
      return ctx.json(ResponseBuilder.success(statistics), 200);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error fetching dashboard statistics';
      logger.error(message, { error });
      return ctx.json(ResponseBuilder.serverError(message), 500);
    }
  };
}

export default ContractController;
export const contractController = new ContractController(contractService);
