import mongoose, {
  ClientSession,
  ConnectOptions,
  Document,
  Model,
} from 'mongoose';

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

  public async startTransaction(): Promise<ClientSession> {
    if (!this.initialized || !this.client) {
      throw new Error(
        'MongoDB client not initialized. Call initialize() first.',
      );
    }

    const session = await this.client.startSession();
    session.startTransaction();
    return session;
  }

  public async commitTransaction(session: ClientSession): Promise<void> {
    try {
      await session.commitTransaction();
      logger.debug('Transaction committed successfully');
    } finally {
      session.endSession();
    }
  }

  public async abortTransaction(session: ClientSession): Promise<void> {
    try {
      await session.abortTransaction();
      logger.debug('Transaction aborted');
    } finally {
      session.endSession();
    }
  }

  public async withTransaction<T>(
    fn: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    if (!this.initialized || !this.client) {
      throw new Error(
        'MongoDB client not initialized. Call initialize() first.',
      );
    }

    const session = await this.client.startSession();
    let result: T;

    try {
      session.startTransaction();
      result = await fn(session);
      await session.commitTransaction();
      logger.debug('Transaction committed successfully');
      return result;
    } catch (error) {
      logger.error('Transaction failed, aborting', { error });
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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
