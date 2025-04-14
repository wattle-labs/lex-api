import mongoose, { ConnectOptions, Document, Model } from 'mongoose';

import { BaseRepository } from '../repositories/base.repository';
import { logger } from './logger';

export type MongoConnectionConfig = {
  uri: string;
  dbName?: string;
  appName?: string;
  replicaSet?: string;
  options?: ConnectOptions;
};

export class MongoService {
  private static instance: MongoService | null = null;

  private client: typeof mongoose | null = null;

  private initialized = false;

  private constructor() {}

  public static getInstance(): MongoService {
    if (!MongoService.instance) {
      MongoService.instance = new MongoService();
    }

    return MongoService.instance;
  }

  public async initialize(config: MongoConnectionConfig): Promise<void> {
    if (this.initialized) {
      logger.info('MongoDB client already initialized');

      return;
    }

    try {
      const connectionOptions: ConnectOptions = {
        ...config.options,
        dbName: config.dbName,
        readPreference: 'secondaryPreferred',
      };

      this.client = await mongoose.connect(config.uri, connectionOptions);

      this.initialized = true;
      logger.info('MongoDB client initialized successfully');
      logger.info('MongoDB connection details:', {
        dbName: config.dbName,
        ...config.options,
      });
    } catch (error) {
      logger.error('Failed to initialize MongoDB client', { error });
      throw error;
    }
  }

  public getClient() {
    if (!this.initialized || !this.client) {
      throw new Error(
        'MongoDB client not initialized. Call initialize() first.',
      );
    }

    return this.client;
  }

  public async getPlaylistRepository() {
    if (!this.initialized || !this.client) {
      throw new Error(
        'MongoDB client not initialized. Call initialize() first.',
      );
    }

    return this.client.connection;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.connection.close();
      this.initialized = false;
      logger.info('MongoDB client disconnected');
    }
  }

  public createRepository<T, R extends BaseRepository<T>>(
    RepositoryClass: new (model: Model<T & Document>) => R,
    model: Model<T & Document>,
  ): R {
    if (!this.initialized || !this.client) {
      throw new Error(
        'MongoDB client not initialized. Call initialize() first.',
      );
    }

    return new RepositoryClass(model);
  }
}

export const mongoService = MongoService.getInstance();
