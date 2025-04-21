import { Context, Next } from 'hono';

import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import {
  PermissionCheckResult,
  policyService,
} from '../services/policy.service';

/**
 * Options for all RBAC middleware
 */
export interface RBACMiddlewareOptions {
  /**
   * How to extract resource ID from request
   * - 'param' (default): Extract from URL params (id, businessId, etc)
   * - 'query': Extract from query parameters
   * - 'body': Extract from request body
   * - 'path': The resource ID is the same as the pathname
   * - Function: Custom extraction function
   */
  resourceIdFrom?:
    | 'param'
    | 'query'
    | 'body'
    | 'path'
    | ((ctx: Context) => string | undefined);
  /**
   * Name of the parameter to extract as resourceId
   * Default: 'id'
   */
  resourceParam?: string;
  /**
   * How to extract business context from request
   * Same options as resourceIdFrom
   */
  businessIdFrom?:
    | 'param'
    | 'query'
    | 'body'
    | 'user'
    | ((ctx: Context) => string | undefined);
  /**
   * Name of the parameter to extract as businessId
   * Default: 'businessId'
   */
  businessParam?: string;
  /**
   * Optional error message to display when permission is denied
   */
  errorMessage?: string;
  /**
   * Call this function with the permission check result before proceeding
   * Return true to allow the request, false to deny it
   */
  additionalCheck?: (
    ctx: Context,
    result?: PermissionCheckResult,
  ) => Promise<boolean> | boolean;
}

/**
 * Middleware that requires a user to have a specific permission
 * @param permission The permission in format "resource:action"
 * @param options Options for resource context and additional checks
 */
export const requirePermission = (
  permission: string,
  options: RBACMiddlewareOptions = {},
) => {
  return async (ctx: Context, next: Next) => {
    try {
      const user = ctx.get('user');

      if (!user) {
        return ctx.json(
          ResponseBuilder.unauthorized('User not authenticated'),
          401,
        );
      }

      // Extract resource ID based on options
      let resourceId: string | undefined;
      const resourceParam = options.resourceParam || 'id';

      if (!options.resourceIdFrom || options.resourceIdFrom === 'param') {
        resourceId = ctx.req.param(resourceParam);
      } else if (options.resourceIdFrom === 'query') {
        resourceId = ctx.req.query(resourceParam);
      } else if (options.resourceIdFrom === 'body') {
        const body = await ctx.req.json();
        resourceId = body[resourceParam];
      } else if (options.resourceIdFrom === 'path') {
        resourceId = ctx.req.path;
      } else if (typeof options.resourceIdFrom === 'function') {
        resourceId = options.resourceIdFrom(ctx);
      }

      // Extract business context
      let businessId: string | undefined;
      const businessParam = options.businessParam || 'businessId';

      if (!options.businessIdFrom || options.businessIdFrom === 'param') {
        businessId = ctx.req.param(businessParam);
      } else if (options.businessIdFrom === 'query') {
        businessId = ctx.req.query(businessParam);
      } else if (options.businessIdFrom === 'body') {
        const body = await ctx.req.json();
        businessId = body[businessParam];
      } else if (options.businessIdFrom === 'user') {
        businessId = user.businessId;
      } else if (typeof options.businessIdFrom === 'function') {
        businessId = options.businessIdFrom(ctx);
      }

      // Check if the user has the required permission
      const permResult = await policyService.checkPermissionWithDetails(
        user.id,
        permission,
        resourceId,
        businessId,
      );

      // Additional custom check if provided
      if (permResult.granted === true && options.additionalCheck) {
        const additionalCheckResult = await options.additionalCheck(
          ctx,
          permResult,
        );
        if (!additionalCheckResult) {
          return ctx.json(
            ResponseBuilder.forbidden(
              options.errorMessage ||
                `Additional permission check failed for: ${permission}`,
            ),
            403,
          );
        }
      }

      if (permResult.granted !== true) {
        return ctx.json(
          ResponseBuilder.forbidden(
            options.errorMessage ||
              `Missing required permission: ${permission}`,
          ),
          403,
        );
      }

      // Add the permission check result to the context for audit logging or other uses
      ctx.set('permissionCheck', permResult);

      // User has permission, continue
      await next();
    } catch (error) {
      logger.error('Error in permission middleware', { permission, error });
      return ctx.json(
        ResponseBuilder.serverError('Error checking permissions'),
        500,
      );
    }
  };
};

/**
 * Middleware that requires a user to have ANY of the specified permissions
 */
export const requirePermissionAny = (
  permissions: string[],
  options: RBACMiddlewareOptions = {},
) => {
  return async (ctx: Context, next: Next) => {
    try {
      const user = ctx.get('user');

      if (!user) {
        return ctx.json(
          ResponseBuilder.unauthorized('User not authenticated'),
          401,
        );
      }

      // Extract resource ID based on options
      let resourceId: string | undefined;
      const resourceParam = options.resourceParam || 'id';

      if (!options.resourceIdFrom || options.resourceIdFrom === 'param') {
        resourceId = ctx.req.param(resourceParam);
      } else if (options.resourceIdFrom === 'query') {
        resourceId = ctx.req.query(resourceParam);
      } else if (options.resourceIdFrom === 'body') {
        const body = await ctx.req.json();
        resourceId = body[resourceParam];
      } else if (options.resourceIdFrom === 'path') {
        resourceId = ctx.req.path;
      } else if (typeof options.resourceIdFrom === 'function') {
        resourceId = options.resourceIdFrom(ctx);
      }

      // Extract business context
      let businessId: string | undefined;
      const businessParam = options.businessParam || 'businessId';

      if (!options.businessIdFrom || options.businessIdFrom === 'param') {
        businessId = ctx.req.param(businessParam);
      } else if (options.businessIdFrom === 'query') {
        businessId = ctx.req.query(businessParam);
      } else if (options.businessIdFrom === 'body') {
        const body = await ctx.req.json();
        businessId = body[businessParam];
      } else if (options.businessIdFrom === 'user') {
        businessId = user.businessId;
      } else if (typeof options.businessIdFrom === 'function') {
        businessId = options.businessIdFrom(ctx);
      }

      // First check the additional condition if provided
      if (options.additionalCheck) {
        const additionalCheckResult = await options.additionalCheck(ctx);
        if (additionalCheckResult === true) {
          // If additional check passes, we can skip permission checks
          await next();
          return;
        }
      }

      const hasAnyPermission = await policyService.hasAnyPermission(
        user.id,
        permissions,
        resourceId,
        businessId,
      );

      if (!hasAnyPermission) {
        return ctx.json(
          ResponseBuilder.forbidden(
            options.errorMessage ||
              `Missing at least one required permission: ${permissions.join(', ')}`,
          ),
          403,
        );
      }

      await next();
    } catch (error) {
      logger.error('Error in permission middleware', { permissions, error });
      return ctx.json(
        ResponseBuilder.serverError('Error checking permissions'),
        500,
      );
    }
  };
};

/**
 * Middleware that requires a user to have ALL of the specified permissions
 */
export const requirePermissionAll = (
  permissions: string[],
  options: RBACMiddlewareOptions = {},
) => {
  return async (ctx: Context, next: Next) => {
    try {
      const user = ctx.get('user');

      if (!user) {
        return ctx.json(
          ResponseBuilder.unauthorized('User not authenticated'),
          401,
        );
      }

      // Extract resource ID based on options
      let resourceId: string | undefined;
      const resourceParam = options.resourceParam || 'id';

      if (!options.resourceIdFrom || options.resourceIdFrom === 'param') {
        resourceId = ctx.req.param(resourceParam);
      } else if (options.resourceIdFrom === 'query') {
        resourceId = ctx.req.query(resourceParam);
      } else if (options.resourceIdFrom === 'body') {
        const body = await ctx.req.json();
        resourceId = body[resourceParam];
      } else if (options.resourceIdFrom === 'path') {
        resourceId = ctx.req.path;
      } else if (typeof options.resourceIdFrom === 'function') {
        resourceId = options.resourceIdFrom(ctx);
      }

      // Extract business context
      let businessId: string | undefined;
      const businessParam = options.businessParam || 'businessId';

      if (!options.businessIdFrom || options.businessIdFrom === 'param') {
        businessId = ctx.req.param(businessParam);
      } else if (options.businessIdFrom === 'query') {
        businessId = ctx.req.query(businessParam);
      } else if (options.businessIdFrom === 'body') {
        const body = await ctx.req.json();
        businessId = body[businessParam];
      } else if (options.businessIdFrom === 'user') {
        businessId = user.businessId;
      } else if (typeof options.businessIdFrom === 'function') {
        businessId = options.businessIdFrom(ctx);
      }

      // Additional check if provided
      if (options.additionalCheck) {
        const additionalCheckResult = await options.additionalCheck(ctx);
        if (!additionalCheckResult) {
          return ctx.json(
            ResponseBuilder.forbidden(
              options.errorMessage || 'Additional permission check failed',
            ),
            403,
          );
        }
      }

      const hasAllPermissions = await policyService.hasAllPermissions(
        user.id,
        permissions,
        resourceId,
        businessId,
      );

      if (!hasAllPermissions) {
        for (const permission of permissions) {
          const hasPermission = await policyService.hasPermission(
            user.id,
            permission,
            resourceId,
            businessId,
          );

          if (!hasPermission) {
            return ctx.json(
              ResponseBuilder.forbidden(
                options.errorMessage ||
                  `Missing required permission: ${permission}`,
              ),
              403,
            );
          }
        }
      }

      await next();
    } catch (error) {
      logger.error('Error in permission middleware', { permissions, error });
      return ctx.json(
        ResponseBuilder.serverError('Error checking permissions'),
        500,
      );
    }
  };
};

/**
 * Middleware that requires a user to be a business owner
 */
export const requireBusinessOwner = (options: RBACMiddlewareOptions = {}) => {
  return async (ctx: Context, next: Next) => {
    try {
      const user = ctx.get('user');

      if (!user) {
        return ctx.json(
          ResponseBuilder.unauthorized('User not authenticated'),
          401,
        );
      }

      // Extract business context
      let businessId: string | undefined;
      const businessParam = options.businessParam || 'businessId';

      if (!options.businessIdFrom || options.businessIdFrom === 'param') {
        businessId = ctx.req.param(businessParam);
      } else if (options.businessIdFrom === 'query') {
        businessId = ctx.req.query(businessParam);
      } else if (options.businessIdFrom === 'body') {
        const body = await ctx.req.json();
        businessId = body[businessParam];
      } else if (options.businessIdFrom === 'user') {
        businessId = user.businessId;
      } else if (typeof options.businessIdFrom === 'function') {
        businessId = options.businessIdFrom(ctx);
      }

      if (!businessId) {
        return ctx.json(
          ResponseBuilder.badRequest('Business ID is required'),
          400,
        );
      }

      const isOwner = await policyService.isBusinessOwner(user.id, businessId);

      if (!isOwner) {
        return ctx.json(
          ResponseBuilder.forbidden(
            options.errorMessage ||
              'Only business owners can perform this action',
          ),
          403,
        );
      }

      // Additional check if provided
      if (options.additionalCheck) {
        const additionalCheckResult = await options.additionalCheck(ctx);
        if (!additionalCheckResult) {
          return ctx.json(
            ResponseBuilder.forbidden(
              options.errorMessage || 'Additional check failed',
            ),
            403,
          );
        }
      }

      await next();
    } catch (error) {
      logger.error('Error in business owner middleware', { error });
      return ctx.json(
        ResponseBuilder.serverError('Error checking business owner status'),
        500,
      );
    }
  };
};

/**
 * Middleware that requires a user to be a system admin
 */
export const requireSystemAdmin = (options: RBACMiddlewareOptions = {}) => {
  return async (ctx: Context, next: Next) => {
    try {
      const user = ctx.get('user');

      if (!user) {
        return ctx.json(
          ResponseBuilder.unauthorized('User not authenticated'),
          401,
        );
      }

      const isAdmin = await policyService.isSystemAdmin(user.id);

      if (!isAdmin) {
        return ctx.json(
          ResponseBuilder.forbidden(
            options.errorMessage ||
              'Only system administrators can perform this action',
          ),
          403,
        );
      }

      // Additional check if provided
      if (options.additionalCheck) {
        const additionalCheckResult = await options.additionalCheck(ctx);
        if (!additionalCheckResult) {
          return ctx.json(
            ResponseBuilder.forbidden(
              options.errorMessage || 'Additional check failed',
            ),
            403,
          );
        }
      }

      await next();
    } catch (error) {
      logger.error('Error in system admin middleware', { error });
      return ctx.json(
        ResponseBuilder.serverError('Error checking system admin status'),
        500,
      );
    }
  };
};
