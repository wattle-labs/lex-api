import { Context, Next } from 'hono';

import { logger } from '../../lib/logger';
import { rbacFacade } from '../facade/rbac.facade';

export function requirePermission(
  resource: string,
  action: string,
  options?: {
    subResource?: string;
    businessIdFrom?: string;
  },
) {
  return async (ctx: Context, next: Next) => {
    try {
      const user = ctx.get('user');

      if (!user) {
        return ctx.json({ error: 'Unauthorized' }, 401);
      }

      const businessIdParam = options?.businessIdFrom || 'businessId';
      const businessId =
        ctx.req.param(businessIdParam) ||
        ctx.req.query(businessIdParam) ||
        user.businessId;

      if (!businessId) {
        return ctx.json({ error: 'Business ID is required' }, 400);
      }

      const hasPermission = await rbacFacade.hasPermission(
        user.id,
        resource,
        action,
        {
          subResource: options?.subResource,
          businessId,
        },
      );

      if (!hasPermission) {
        return ctx.json({ error: 'Permission denied' }, 403);
      }

      return await next();
    } catch (error) {
      logger.error('Permission check error:', { error });
      return ctx.json({ error: 'Permission check failed' }, 500);
    }
  };
}
