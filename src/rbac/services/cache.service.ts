import { Permission } from '../domain/models/permission';

const permissionCache = new Map<string, Permission[]>();

export const cacheService = {
  getUserPermissions(key: string): Permission[] | undefined {
    return permissionCache.get(key);
  },

  setUserPermissions(key: string, permissions: Permission[]): void {
    permissionCache.set(key, permissions);
  },

  invalidateUserCache(key: string): void {
    permissionCache.delete(key);
  },

  clearCache(): void {
    permissionCache.clear();
  },
};
