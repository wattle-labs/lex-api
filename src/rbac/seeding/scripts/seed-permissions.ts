import dotenv from 'dotenv';

import { logger } from '../../../lib/logger';
import { mongoService } from '../../../lib/mongo';
import { businessSeederService } from '../services/business-seeder.service';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'lex-db';

async function seedPermissions() {
  try {
    const businessId = process.argv[2];
    const businessType = process.argv[3] || 'default';

    if (!businessId) {
      console.error('Business ID is required');
      console.log(
        'Usage: npm run seed-permissions [businessId] [businessType]',
      );
      process.exit(1);
    }

    logger.info('Initializing MongoDB');
    await mongoService.initialize({
      uri: MONGO_URI,
      dbName: MONGO_DB_NAME,
    });

    logger.info(
      `Starting permission seeding for business ${businessId} with type ${businessType}`,
    );

    if (process.argv[3]) {
      await businessSeederService.seedNewBusiness(businessId, businessType);
    } else {
      await businessSeederService.updateExistingBusiness(businessId);
    }

    logger.info('Permission seeding completed successfully');

    await mongoService.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding permissions', { error });
    process.exit(1);
  }
}

seedPermissions();
