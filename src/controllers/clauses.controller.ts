import { Context } from 'hono';

// import { VALIDATION_TARGETS } from '../constants/validation.constants';
// import { VALIDATION_MIDDLEWARE_KEY } from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { Clause } from '../models/interfaces/clause';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ClauseService } from '../services/clauses.service';
import { BaseController } from './base.controller';

class ClauseController extends BaseController<
  MongooseModel<Clause>,
  ClauseService
> {
  constructor(service: ClauseService) {
    super(service, 'clause');
  }

  initialize = async (ctx: Context): Promise<Response> => {
    try {
      logger.info(`Initializing clauses`);
      await this.service.initialize();
      return ctx.json(ResponseBuilder.success(null), 200);
    } catch (error) {
      logger.error('Failed to initialize clauses', { error });
      const message =
        error instanceof Error ? error.message : 'Failed to initialize clauses';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };

  findAll = async (ctx: Context): Promise<Response> => {
    try {
      const clauses = await this.service.findAll({});
      return ctx.json(ResponseBuilder.success(clauses), 200);
    } catch (error) {
      logger.error('Failed to find clauses', { error });
      const message =
        error instanceof Error ? error.message : 'Failed to find clauses';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };
}

export default ClauseController;
