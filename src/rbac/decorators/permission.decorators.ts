import { Context } from 'hono';

import { VALIDATION_MIDDLEWARE_KEY } from '../../constants/validation.constants';
import { rbacFacade } from '../facade/rbac.facade';

export function RequirePermission(
  resource: string,
  action: string,
  options?: {
    subResource?: string;
    businessIdParam?: string;
    businessIdFrom?: string;
  },
) {
  return function (
    _target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const ctx = args[0] as Context;
      const user = ctx.get('user');

      if (!user) {
        throw new Error('Unauthorized - no user in context');
      }

      const { businessId } = ctx.get(
        `${VALIDATION_MIDDLEWARE_KEY}:${options?.businessIdFrom}`,
      );

      if (!businessId) {
        throw new Error('Business ID is required');
      }

      await rbacFacade.checkPermission(user.id, resource, action, {
        subResource: options?.subResource,
        businessId,
      });

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
