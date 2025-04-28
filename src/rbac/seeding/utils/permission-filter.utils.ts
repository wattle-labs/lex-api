import { PermissionDefinition } from '../interfaces/permission-definition.interface';

export interface PermissionSelector {
  resource?: string;
  subResource?: string;
  action?: string;
  all?: boolean;
}

export interface PermissionRules {
  include: PermissionSelector[];
  exclude: PermissionSelector[];
}

export function applyPermissionRules(
  permissions: PermissionDefinition[],
  rules: PermissionRules,
): PermissionDefinition[] {
  let result: PermissionDefinition[] = [];

  if (rules.include.some(rule => rule.all)) {
    result = [...permissions];
  } else {
    result = permissions.filter(permission => {
      return rules.include.some(selector =>
        matchesSelector(permission, selector),
      );
    });
  }

  result = result.filter(permission => {
    return !rules.exclude.some(selector =>
      matchesSelector(permission, selector),
    );
  });

  return result;
}

function matchesSelector(
  permission: PermissionDefinition,
  selector: PermissionSelector,
): boolean {
  if (selector.all) {
    return true;
  }

  if (selector.resource && permission.resource !== selector.resource) {
    return false;
  }

  if (selector.subResource !== undefined) {
    if (permission.subResource === undefined) {
      return false;
    }

    if (permission.subResource !== selector.subResource) {
      return false;
    }
  }

  if (selector.action && permission.action !== selector.action) {
    return false;
  }

  return true;
}
