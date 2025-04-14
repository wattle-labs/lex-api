import { Context } from 'hono';

import {
  VALIDATION_MIDDLEWARE_KEY,
  VALIDATION_TARGETS,
} from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { Business } from '../models/interfaces/business';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BusinessService } from '../services/businesses.service';
import { BaseController } from './base.controller';

class BusinessController extends BaseController<
  MongooseModel<Business>,
  BusinessService
> {
  constructor(service: BusinessService) {
    super(service, 'business');
  }

  findBySlug = async (ctx: Context): Promise<Response> => {
    const { slug } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    try {
      logger.info('Finding businesses by slug', { slug });
      const business = await this.service.findBySlug(slug);

      if (!business) {
        return ctx.json(ResponseBuilder.notFound('Business not found'), 404);
      }

      return ctx.json(ResponseBuilder.success(business), 200);
    } catch (error) {
      logger.error(
        'Failed to find businesses by slug',
        { slug },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to find businesses by slug';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };
}

export default BusinessController;
