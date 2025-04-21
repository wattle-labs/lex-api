import { Context, Next } from 'hono';

import { businessRepository } from '../../repositories/businesses.repository';

export const businessesMiddleware = async (ctx: Context, next: Next) => {
  const businessId = ctx.req.param('businessId');

  if (!businessId) {
    return ctx.json({ error: 'Business ID is required' }, 400);
  }

  const business = await businessRepository.findById({ id: businessId });

  if (!business) {
    return ctx.json({ error: 'Business not found' }, 404);
  }

  return await next();
};
