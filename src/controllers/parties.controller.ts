import { Context } from 'hono';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import { VALIDATION_MIDDLEWARE_KEY } from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { MongooseModel } from '../models/interfaces/document';
import { Party } from '../models/interfaces/party';
import { PartyService } from '../services/parties.service';
import { BaseController } from './base.controller';

class PartyController extends BaseController<
  MongooseModel<Party>,
  PartyService
> {
  constructor(service: PartyService) {
    super(service, 'party');
  }

  findByName = async (ctx: Context): Promise<Response> => {
    const { name } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.BODY}`,
    );

    try {
      logger.info(`Finding parties by name: ${name}`);
      const parties = await this.service.findByName(name);
      return ctx.json(ResponseBuilder.success(parties), 200);
    } catch (error) {
      logger.error(
        'Failed to find parties by name',
        { name },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to find parties by name';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };
}

export default PartyController;
