import { Context, Next } from 'hono';

import { ResponseBuilder } from '../../lib/response.handler';
import { adminRepository } from '../../repositories/admins.repository';
import { businessRepository } from '../../repositories/businesses.repository';
import { userRepository } from '../../repositories/users.repository';

export const businessesMiddleware = async (ctx: Context, next: Next) => {
  const businessId = ctx.req.param('businessId');
  const authUser = ctx.get('user');
  const userId = authUser?._id;

  if (!businessId) {
    return ctx.json(
      ResponseBuilder.error('Business ID is required', '400', 400),
    );
  }

  const business = await businessRepository.findById({ id: businessId });

  if (!business) {
    return ctx.json(ResponseBuilder.error('Business not found', '404', 404));
  }

  const isAdmin = await adminRepository.findByUserId(userId);

  if (!isAdmin) {
    const user = await userRepository.findUserByBusiness(userId, businessId);

    if (!user) {
      return ctx.json(ResponseBuilder.error('Access denied', '403', 403));
    }
  }

  return await next();
};
