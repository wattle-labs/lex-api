import { PermissionAction } from '../../../constants/permission-actions.constants';
import {
  PermissionResource,
  PermissionSubResource,
} from '../../../constants/permission-resources.constants';

export const rolePermissionRules = {
  BUSINESS_ADMINISTRATOR: {
    include: [{ all: true }],
    exclude: [],
  },

  BUSINESS_MANAGER: {
    include: [{ all: true }],
    exclude: [
      { resource: PermissionResource.ADMIN },
      {
        resource: PermissionResource.BUSINESS,
        subResource: PermissionSubResource.BILLING,
        action: PermissionAction.MANAGE,
      },
      {
        resource: PermissionResource.BUSINESS,
        subResource: PermissionSubResource.ROLES,
        action: PermissionAction.MANAGE,
      },
    ],
  },

  PROJECT_MANAGER: {
    include: [
      { resource: PermissionResource.PROJECT },

      {
        resource: PermissionResource.USER,
        action: PermissionAction.READ,
      },
      {
        resource: PermissionResource.USER,
        action: PermissionAction.INVITE,
      },

      {
        resource: PermissionResource.CONTRACT,
        action: PermissionAction.READ,
      },
      {
        resource: PermissionResource.CONTRACT,
        action: PermissionAction.CREATE,
      },

      {
        resource: PermissionResource.BUSINESS,
        subResource: PermissionSubResource.INVITES,
        action: PermissionAction.READ,
      },
      {
        resource: PermissionResource.BUSINESS,
        subResource: PermissionSubResource.INVITES,
        action: PermissionAction.CREATE,
      },
    ],
    exclude: [],
  },

  LEGAL_MANAGER: {
    include: [
      { resource: PermissionResource.CONTRACT },

      {
        resource: PermissionResource.PROJECT,
        action: PermissionAction.READ,
      },
      {
        resource: PermissionResource.USER,
        action: PermissionAction.READ,
      },
    ],
    exclude: [],
  },

  TEAM_MEMBER: {
    include: [
      {
        resource: PermissionResource.PROJECT,
        action: PermissionAction.READ,
      },
      {
        resource: PermissionResource.CONTRACT,
        action: PermissionAction.READ,
      },
      {
        resource: PermissionResource.USER,
        action: PermissionAction.READ,
      },
    ],
    exclude: [],
  },
};
