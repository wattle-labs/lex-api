import dotenv from 'dotenv';

import { logger } from '../src/lib/logger';
import { mongoService } from '../src/lib/mongo';
import { permissionRegistry } from '../src/rbac/seeding/permissions';

const isLocal = process.argv[2] === '--local';
const performClean = process.argv[2] === '--clean';

dotenv.config({
  path: isLocal ? '.env' : '.env.production',
});

async function seedUserPermissions() {
  try {
    logger.initialize(
      process.env.SERVICE_ID || 'lex-api',
      process.env.API_LOG_LEVEL || 'debug',
      process.env.API_LOG_COLORIZE === 'false' ? false : true,
    );

    logger.info('Initializing MongoDB');
    await mongoService.initialize({
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
      dbName: process.env.MONGO_DB_NAME || 'lex-db',
      options: {
        appName: process.env.MONGO_APP_NAME,
        replicaSet: process.env.MONGO_REPLICA_SET,
      },
    });

    const { userPermissionRepository } = await import(
      '../src/repositories/userPermissions.repository'
    );

    logger.info(`Seeding ${permissionRegistry.length} UserPermissions...`);
    let createdCount = 0;
    let existingCount = 0;
    let errorCount = 0;

    if (performClean) {
      logger.info('Cleaning existing UserPermissions...');
      await userPermissionRepository.deleteMany({
        filter: {},
      });
      logger.info(`Cleaned existing UserPermissions`);
    }

    for (const permDef of permissionRegistry) {
      const {
        resource,
        action,
        subResource,
        description,
        category,
        implications,
      } = permDef;

      if (!resource || !action) {
        logger.error(
          'Invalid permission definition missing resource or action',
          {
            permDef: JSON.stringify(permDef),
          },
        );
        errorCount++;
        continue;
      }

      const name = subResource
        ? `${resource}:${subResource}:${action}`
        : `${resource}:${action}`;

      try {
        const existingPerm = await userPermissionRepository.findOne({
          filter: {
            name,
            businessId: { $exists: false },
          },
        });

        if (existingPerm) {
          logger.debug(
            `UserPermission ${name} already exists (ID: ${existingPerm.id})`,
          );
          existingCount++;
          continue;
        }

        const newPermission = await userPermissionRepository.create({
          data: {
            name,
            resource,
            action,
            subResource,
            description:
              description ||
              `Permission to ${action} ${resource}${subResource ? ' ' + subResource : ''}`,
            category: category || 'General',
            isSystem: true,
            implications,
          },
        });

        logger.debug(
          `Created UserPermission ${name} (ID: ${newPermission.id})`,
        );
        createdCount++;
      } catch (err) {
        logger.error(`Error creating permission ${name}:`, err);
        errorCount++;
      }
    }

    logger.info('Completed UserPermission seeding:');
    logger.info(`- Created: ${createdCount}`);
    logger.info(`- Already existed: ${existingCount}`);
    logger.info(`- Errors: ${errorCount}`);

    const totalPerms = await userPermissionRepository.count({
      filter: { businessId: { $exists: false } },
    });
    logger.info(`Total UserPermissions in database: ${totalPerms}`);

    if (totalPerms !== permissionRegistry.length) {
      logger.warn(
        `Warning: Number of permissions in registry (${permissionRegistry.length}) does not match database count (${totalPerms})`,
      );
    }
  } catch (error) {
    logger.error('Failed to seed UserPermissions', { error });
    throw error;
  } finally {
    await mongoService.disconnect();
  }
}

seedUserPermissions()
  .then(() => {
    logger.info('UserPermission seeding completed successfully');
    process.exit(0);
  })
  .catch(error => {
    logger.error('UserPermission seeding failed', { error });
    process.exit(1);
  });
