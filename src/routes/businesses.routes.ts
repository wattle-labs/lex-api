import { createRoute } from '@hono/zod-openapi';
import { Context } from 'hono';
import { z as zod } from 'zod';

import { VALIDATION_TARGETS } from '../constants/validation.constants';
import BusinessController from '../controllers/businesses.controller';
import {
  requireBusinessOwner,
  requirePermission,
  requirePermissionAny,
} from '../middlewares/policy.middleware';
import { businessesMiddleware } from '../middlewares/resources/businesses.middleware';
import { userRoleTemplateRepository } from '../repositories';
import {
  ErrorResponseSchema,
  createPaginatedResponseSchema,
  createSuccessResponseSchema,
} from '../utils/swagger-response.utils';
import { mergeValidators } from '../validators';
import {
  businessIdPathParamValidator,
  businessSlugPathParamValidator,
} from '../validators/businesses.validation';
import { businessCreateBodyValidator } from '../validators/businesses.validation';
import { businessSchema } from '../validators/schemas/business.schema';
import { invitationSchema } from '../validators/schemas/invitation.schema';
import { userSchema } from '../validators/schemas/user.schema';
import { userPermissionSchema } from '../validators/schemas/userPermission.schema';
import { userRoleSchema } from '../validators/schemas/userRole.schema';
import { userRoleTemplateSchema } from '../validators/schemas/userRoleTemplate.schema';
import { userPermissionCreateBodyValidator } from '../validators/userPermissions.validation';
import { userRoleTemplateCreateBodyValidator } from '../validators/userRoleTemplates.validation';
import { userIdPathParamValidator } from '../validators/users.validation';
import { BaseRoutes } from './base.routes';

export class BusinessRoutes extends BaseRoutes {
  PATH = '/businesses';

  protected RESOURCE_NAME = 'businesses';

  constructor(protected readonly businessController: BusinessController) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/slug/:slug',
          summary: 'Get business by slug',
          tags: [this.RESOURCE_NAME],
          request: {
            params: businessSlugPathParamValidator.openapi('Path parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(businessSchema),
                },
              },
            },
            '404': {
              description: 'Business not found',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.findBySlug,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: businessSlugPathParamValidator,
          },
        ],
        middlewares: [businessesMiddleware],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/:businessId/invitations',
          summary: 'Create invitation',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(invitationSchema),
                },
              },
            },
            '404': {
              description: 'Business not found',
              content: {},
            },
            '500': {
              description: 'Internal server error',
              content: {},
            },
          },
        }),
        handler: this.businessController.createInvitation,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: businessIdPathParamValidator,
          },
          {
            target: VALIDATION_TARGETS.BODY,
            schema: invitationSchema.omit({
              id: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            }),
          },
        ],
        middlewares: [
          businessesMiddleware,
          requirePermission('business:invitations:create'),
        ],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/:businessId/users/:userId/assign-role',
          summary: 'Assign role to user',
          tags: [this.RESOURCE_NAME],
          request: {},
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(userSchema),
                },
              },
            },
            '404': {
              description: 'Business not found',
              content: {},
            },
            '500': {
              description: 'Internal server error',
              content: {},
            },
          },
        }),
        handler: this.businessController.assignRoleToUser,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: mergeValidators(
              businessIdPathParamValidator,
              userIdPathParamValidator,
            ),
          },
          {
            target: VALIDATION_TARGETS.BODY,
            schema: zod.object({
              roleTemplateId: zod.string(),
            }),
          },
        ],
        middlewares: [
          businessesMiddleware,
          requirePermission('business:users:assign-role'),
        ],
      },
      {
        route: createRoute({
          method: 'post',
          path: '',
          summary: 'Create a new business',
          tags: [this.RESOURCE_NAME],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: businessCreateBodyValidator,
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Business created successfully',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(businessSchema),
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '403': {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.create,
        validations: [
          {
            target: VALIDATION_TARGETS.BODY,
            schema: businessCreateBodyValidator,
          },
        ],
        middlewares: [requirePermission('business:create')],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/:businessId/permissions',
          summary: 'Create permission',
          tags: [this.RESOURCE_NAME],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: userPermissionCreateBodyValidator,
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Permission created successfully',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(userPermissionSchema),
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '403': {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.createPermission,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: businessIdPathParamValidator,
          },
          {
            target: VALIDATION_TARGETS.BODY,
            schema: userPermissionCreateBodyValidator,
          },
        ],
        middlewares: [
          requirePermission('business:user-permissions:create'),
          businessesMiddleware,
        ],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/:businessId/role-templates',
          summary: 'Create a role template',
          tags: [this.RESOURCE_NAME],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: userRoleTemplateCreateBodyValidator,
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Permission created successfully',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(userRoleTemplateSchema),
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '403': {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.createRoleTemplate,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: businessIdPathParamValidator,
          },
          {
            target: VALIDATION_TARGETS.BODY,
            schema: userRoleTemplateCreateBodyValidator,
          },
        ],
        middlewares: [
          requirePermission('business:user-role-templates:create'),
          businessesMiddleware,
        ],
      },
      {
        route: createRoute({
          method: 'get',
          path: '/:businessId/permissions',
          summary: 'List all permissions for a business',
          tags: [this.RESOURCE_NAME],
          request: {
            params: businessIdPathParamValidator.openapi('Path parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(userPermissionSchema),
                },
              },
            },
            '404': {
              description: 'Business not found',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.listPermissions,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: businessIdPathParamValidator,
          },
        ],
        middlewares: [
          requirePermission('business:user-permissions:read', {
            businessIdFrom: 'param',
          }),
          businessesMiddleware,
        ],
      },
      {
        route: createRoute({
          method: 'get',
          path: '/:businessId/role-templates',
          summary: 'List all role templates for a business',
          tags: [this.RESOURCE_NAME],
          request: {
            params: businessIdPathParamValidator.openapi('Path parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(userRoleTemplateSchema),
                },
              },
            },
            '404': {
              description: 'Business not found',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.listRoleTemplates,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: businessIdPathParamValidator,
          },
        ],
        middlewares: [
          requirePermission('business:user-role-templates:read', {
            businessIdFrom: 'param',
          }),
          businessesMiddleware,
        ],
      },
      {
        route: createRoute({
          method: 'get',
          path: '/:businessId/users/:userId/roles',
          summary: 'List roles for a user in this business',
          tags: [this.RESOURCE_NAME],
          request: {
            params: mergeValidators(
              businessIdPathParamValidator,
              userIdPathParamValidator,
            ).openapi('Path parameters'),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: createPaginatedResponseSchema(userRoleSchema),
                },
              },
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.listUserRoles,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: mergeValidators(
              businessIdPathParamValidator,
              userIdPathParamValidator,
            ),
          },
        ],
        middlewares: [
          requirePermissionAny(['business:users:read'], {
            businessIdFrom: 'param',
            additionalCheck: ctx => {
              const user = ctx.get('user');
              const userId = ctx.req.param('userId');
              return user.id === userId;
            },
          }),
          businessesMiddleware,
        ],
      },
      {
        route: createRoute({
          method: 'post',
          path: '/:businessId/role-templates/:templateId/permissions',
          summary: 'Add permissions to a role template',
          tags: [this.RESOURCE_NAME],
          request: {
            params: mergeValidators(
              businessIdPathParamValidator,
              zod.object({
                templateId: zod.string().min(1),
              }),
            ).openapi('Path parameters'),
            body: {
              content: {
                'application/json': {
                  schema: zod.object({
                    permissionIds: zod.array(zod.string().min(1)),
                  }),
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Permissions added successfully',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(userRoleTemplateSchema),
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.addPermissionsToRoleTemplate,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: mergeValidators(
              businessIdPathParamValidator,
              zod.object({
                templateId: zod.string().min(1),
              }),
            ),
          },
          {
            target: VALIDATION_TARGETS.BODY,
            schema: zod.object({
              permissionIds: zod.array(zod.string().min(1)),
            }),
          },
        ],
        middlewares: [
          requirePermission('business:user-role-templates:update', {
            businessIdFrom: 'param',
            resourceIdFrom: ctx => ctx.req.param('templateId'),
          }),
          businessesMiddleware,
        ],
      },
      {
        route: createRoute({
          method: 'delete',
          path: '/:businessId/role-templates/:templateId',
          summary: 'Delete a role template',
          tags: [this.RESOURCE_NAME],
          request: {
            params: mergeValidators(
              businessIdPathParamValidator,
              zod.object({
                templateId: zod.string().min(1),
              }),
            ).openapi('Path parameters'),
          },
          responses: {
            '200': {
              description: 'Role template deleted successfully',
              content: {
                'application/json': {
                  schema: createSuccessResponseSchema(zod.boolean()),
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '404': {
              description: 'Not found',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: ErrorResponseSchema,
                },
              },
            },
          },
        }),
        handler: this.businessController.deleteRoleTemplate,
        validations: [
          {
            target: VALIDATION_TARGETS.PARAMS,
            schema: mergeValidators(
              businessIdPathParamValidator,
              zod.object({
                templateId: zod.string().min(1),
              }),
            ),
          },
        ],
        middlewares: [
          requireBusinessOwner({
            businessIdFrom: 'param',
            additionalCheck: async ctx => {
              const templateId = ctx.req.param('templateId');
              const template = await userRoleTemplateRepository.findById({
                id: templateId,
              });
              return !template?.isSystem;
            },
            errorMessage:
              'Only business owners can delete custom role templates. System roles cannot be deleted.',
          }),
          businessesMiddleware,
        ],
      },
    ];

    routes.forEach(({ route, handler, validations, middlewares = [] }) => {
      this.registerRoute(
        route,
        handler as (ctx: Context) => Promise<Response>,
        {
          validations,
          middlewares,
        },
      );
    });
  }
}

export const createBusinessRoutes = (
  businessController: BusinessController,
): BusinessRoutes => {
  return new BusinessRoutes(businessController);
};
