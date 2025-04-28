import { adminRepository } from '../../repositories';
import { Permission } from '../domain/models/permission';
import { permissionService } from '../services/permission.service';
import {
  PermissionContext,
  userAccessService,
} from '../services/user-access.service';

export const rbacFacade = {
  async hasPermission(
    userId: string,
    resource: string,
    action: string,
    options?: {
      subResource?: string;
      businessId?: string;
      projectId?: string;
    },
  ): Promise<boolean> {
    const isAdmin = await adminRepository.findOne({
      filter: { userId },
    });

    if (isAdmin) {
      return true;
    }

    const permission = permissionService.createPermission(
      resource,
      action,
      options?.subResource,
    );

    const context: PermissionContext = {
      businessId: options?.businessId,
      projectId: options?.projectId,
    };

    return userAccessService.hasPermission(userId, permission, context);
  },

  async checkPermission(
    userId: string,
    resource: string,
    action: string,
    options?: {
      subResource?: string;
      businessId?: string;
      projectId?: string;
    },
  ): Promise<void> {
    const hasPermission = await this.hasPermission(
      userId,
      resource,
      action,
      options,
    );

    if (!hasPermission) {
      throw new Error(
        `Permission denied: ${resource}:${options?.subResource || ''}:${action}`,
      );
    }
  },

  createPermission(
    resource: string,
    action: string,
    subResource?: string,
  ): Permission {
    return permissionService.createPermission(resource, action, subResource);
  },
};
