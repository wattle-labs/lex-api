import { Context } from 'hono';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import { VALIDATION_MIDDLEWARE_KEY } from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { MongooseModel } from '../models/interfaces/document';
import { View } from '../models/interfaces/view';
import { ViewsService } from '../services/views.service';
import { BaseController } from './base.controller';

class ViewsController extends BaseController<
  MongooseModel<View>,
  ViewsService
> {
  constructor(service: ViewsService) {
    super(service, 'view');
  }

  getContractsForView = async (ctx: Context): Promise<Response> => {
    const { id } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    try {
      logger.info(`Finding contracts for view: ${id}`);
      const contracts = await this.service.getContractsForView(id);
      return ctx.json(ResponseBuilder.success(contracts), 200);
    } catch (error) {
      logger.error(
        'Failed to find contracts for view',
        { id },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to find contracts for view';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };
}

export default ViewsController;
