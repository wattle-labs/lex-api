import { Context } from 'hono';

import {
  VALIDATION_MIDDLEWARE_KEY,
  VALIDATION_TARGETS,
} from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { BusinessService } from '../services/businesses.service';

class BusinessController {
  constructor(private readonly service: BusinessService) {}

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

  createInvitation = async (ctx: Context): Promise<Response> => {
    const data = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.BODY}`,
    );
    const { businessId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    const invitation = await this.service.createInvitation(businessId, data);

    return ctx.json(ResponseBuilder.success(invitation), 201);
  };

  assignRoleToUser = async (ctx: Context): Promise<Response> => {
    const assignee = ctx.get('user');
    const { roleTemplateId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.BODY}`,
    );
    const { businessId, userId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    await this.service.assignRoleToUser(
      businessId,
      userId,
      roleTemplateId,
      assignee.id,
    );

    logger.info('Assigned role to user', { userId, roleTemplateId });

    return ctx.json(ResponseBuilder.success(null), 201);
  };

  create = async (ctx: Context): Promise<Response> => {
    const data = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.BODY}`,
    );

    try {
      logger.info('Creating new business');
      const business = await this.service.create(data);

      return ctx.json(ResponseBuilder.success(business), 201);
    } catch (error) {
      logger.error('Failed to create business', { error });

      return ctx.json(
        ResponseBuilder.badRequest('Failed to create business'),
        400,
      );
    }
  };

  createPermission = async (ctx: Context): Promise<Response> => {
    const data = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.BODY}`,
    );
    const { businessId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    const permission = await this.service.createPermission(businessId, data);

    return ctx.json(ResponseBuilder.success(permission), 201);
  };

  createRoleTemplate = async (ctx: Context): Promise<Response> => {
    const data = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.BODY}`,
    );
    const { businessId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    const roleTemplate = await this.service.createRoleTemplate(
      businessId,
      data,
    );

    return ctx.json(ResponseBuilder.success(roleTemplate), 201);
  };

  listPermissions = async (ctx: Context): Promise<Response> => {
    const { businessId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    try {
      logger.info('Listing permissions for business', { businessId });
      const permissions = await this.service.listPermissions(businessId);

      return ctx.json(ResponseBuilder.success(permissions), 200);
    } catch (error) {
      logger.error(
        'Failed to list permissions',
        { businessId },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error ? error.message : 'Failed to list permissions';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };

  listRoleTemplates = async (ctx: Context): Promise<Response> => {
    const { businessId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    try {
      logger.info('Listing role templates for business', { businessId });
      const roleTemplates = await this.service.listRoleTemplates(businessId);

      return ctx.json(ResponseBuilder.success(roleTemplates), 200);
    } catch (error) {
      logger.error(
        'Failed to list role templates',
        { businessId },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to list role templates';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };

  listUserRoles = async (ctx: Context): Promise<Response> => {
    const { businessId, userId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    try {
      logger.info('Listing user roles', { businessId, userId });
      const roles = await this.service.listUserRoles(businessId, userId);

      return ctx.json(ResponseBuilder.success(roles), 200);
    } catch (error) {
      logger.error(
        'Failed to list user roles',
        { businessId, userId },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error ? error.message : 'Failed to list user roles';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };

  addPermissionsToRoleTemplate = async (ctx: Context): Promise<Response> => {
    const { businessId, templateId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );
    const { permissionIds } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.BODY}`,
    );

    try {
      logger.info('Adding permissions to role template', {
        businessId,
        templateId,
        permissionIds,
      });

      const updatedTemplate = await this.service.addPermissionsToRoleTemplate(
        businessId,
        templateId,
        permissionIds,
      );

      return ctx.json(ResponseBuilder.success(updatedTemplate), 200);
    } catch (error) {
      logger.error(
        'Failed to add permissions to role template',
        { businessId, templateId, permissionIds },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to add permissions to role template';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };

  deleteRoleTemplate = async (ctx: Context): Promise<Response> => {
    const { businessId, templateId } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );

    try {
      logger.info('Deleting role template', { businessId, templateId });
      const deleted = await this.service.deleteRoleTemplate(
        businessId,
        templateId,
      );

      return ctx.json(ResponseBuilder.success(deleted), 200);
    } catch (error) {
      logger.error(
        'Failed to delete role template',
        { businessId, templateId },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete role template';

      return ctx.json(ResponseBuilder.badRequest(message), 400);
    }
  };
}

export default BusinessController;
