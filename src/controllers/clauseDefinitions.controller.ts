import { Context } from 'hono';

// import { VALIDATION_TARGETS } from '../constants/validation.constants';
// import { VALIDATION_MIDDLEWARE_KEY } from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { ClauseDefinition } from '../models/interfaces/clauseDefinition';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ClauseDefinitionService } from '../services/clauseDefinitions.service';
import { BaseController } from './base.controller';

class ClauseDefinitionController extends BaseController<
  MongooseModel<ClauseDefinition>,
  ClauseDefinitionService
> {
  constructor(service: ClauseDefinitionService) {
    super(service, 'clauseDefinition');
  }

  /**
   * Initializes the clauses
   * @param ctx
   * @returns
   */
  initialize = async (ctx: Context): Promise<Response> => {
    try {
      logger.info(`Initializing clause definitions`);
      await this.service.initialize();
      return ctx.json(ResponseBuilder.success(null), 200);
    } catch (error) {
      logger.error('Failed to initialize clause definitions', { error });
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to initialize clause definitions';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };

  findAll = async (ctx: Context): Promise<Response> => {
    try {
      const user = ctx.get('user');
      const clauses = await this.service.findAll({
        options: {
          businessId: user.businessId,
        },
      });
      return ctx.json(ResponseBuilder.success(clauses), 200);
    } catch (error) {
      logger.error('Failed to find clauses', { error });
      const message =
        error instanceof Error ? error.message : 'Failed to find clauses';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };

  // @todo - Restrict permissions to editors
  create = async (ctx: Context): Promise<Response> => {
    try {
      const _data = await ctx.req.json();
      const user = ctx.get('user');
      const data: ClauseDefinition = {
        ..._data,
        isCustom: true,
        businessId: user.businessId,
      };
      const clause = await this.service.create(data);
      return ctx.json(ResponseBuilder.success(clause), 200);
    } catch (error) {
      logger.error('Failed to create clause', { error });
      const message =
        error instanceof Error ? error.message : 'Failed to create clause';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };
}

export default ClauseDefinitionController;
