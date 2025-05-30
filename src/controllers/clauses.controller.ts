import { Context } from 'hono';

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
      const data: Clause = {
        ..._data,
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

export default ClauseController;
