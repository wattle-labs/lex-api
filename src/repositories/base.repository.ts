import { ClientSession, Document, Model, UpdateQuery } from 'mongoose';

import {
  IRepository,
  countOptions,
  createManyOptions,
  createOptions,
  deleteOptions,
  findAllOptions,
  findByIdOptions,
  findOneOptions,
  updateOptions,
} from '../interfaces/repository.interface';

interface EnhancedError extends Error {
  originalError?: Error;
  data?: unknown;
}

export class BaseRepository<T> implements IRepository<T> {
  constructor(protected readonly model: Model<T & Document>) {}

  public async count(
    options: countOptions<T> & { session?: ClientSession },
  ): Promise<number> {
    const { filter, session } = options;
    const query = this.model.countDocuments(filter);
    if (session) {
      query.session(session);
    }
    return query.exec();
  }

  public async create(options: createOptions<T>): Promise<T> {
    const { data, session } = options;
    try {
      const result = await this.model.create([data], { session });
      if (!result || result.length === 0) {
        throw new Error(`Create operation failed to return a document`);
      }
      return result[0].toObject() as T;
    } catch (error) {
      if (error instanceof Error) {
        const enhancedError: EnhancedError = new Error(
          `Failed to create document: ${error.message}`,
        );

        enhancedError.stack = error.stack;

        enhancedError.originalError = error;
        enhancedError.data = data;
        throw enhancedError;
      }
      throw error;
    }
  }

  public async createMany(options: createManyOptions<T>): Promise<T[]> {
    const { data, session } = options;
    try {
      const result = await this.model.create(data, { session });
      if (!result || result.length === 0) {
        throw new Error(`Create operation failed to return documents`);
      }
      return result.map(doc => doc.toObject() as T);
    } catch (error) {
      if (error instanceof Error) {
        const enhancedError: EnhancedError = new Error(
          `Failed to create documents: ${error.message}`,
        );

        enhancedError.stack = error.stack;

        enhancedError.originalError = error;
        enhancedError.data = data;
        throw enhancedError;
      }
      throw error;
    }
  }

  public async find(options: findAllOptions<T>): Promise<T[]> {
    const {
      filter,
      fields,
      options: queryOptions,
      limit,
      skip,
      sort,
      session,
    } = options;

    let query = this.model.find(filter ?? {}, fields, queryOptions);

    if (limit !== undefined) {
      query = query.limit(limit);
    }

    if (skip !== undefined) {
      query = query.skip(skip);
    }

    if (sort) {
      query = query.sort(sort);
    }

    if (session) {
      query = query.session(session);
    }

    const result = await query.lean({ virtuals: true });
    return result as T[];
  }

  public async findById(options: findByIdOptions<T>): Promise<T | null> {
    const { id, fields, options: queryOptions, session } = options;
    const query = this.model.findById(id, fields, queryOptions);

    if (session) {
      query.session(session);
    }

    const result = await query.lean({ virtuals: true });
    return result as T | null;
  }

  public async findOne(options: findOneOptions<T>): Promise<T | null> {
    const { filter, fields, options: queryOptions, session } = options;
    const query = this.model.findOne(filter, fields, queryOptions);

    if (session) {
      query.session(session);
    }

    const result = await query.lean({ virtuals: true });
    return result as T | null;
  }

  public async update(options: updateOptions<T>): Promise<T | null> {
    const { filter, update, push, options: queryOptions, session } = options;
    const updateQuery = {
      ...(push ? { $push: push } : {}),
      ...(update ? { $set: update } : {}),
    };

    const query = this.model.findOneAndUpdate(
      filter,
      updateQuery as UpdateQuery<T & Document>,
      {
        new: true,
        ...queryOptions,
      },
    );

    if (session) {
      query.session(session);
    }

    const result = await query.lean({ virtuals: true });
    return result as T | null;
  }

  public async delete(options: deleteOptions<T>): Promise<boolean> {
    const { filter, session } = options;
    const query = this.model.deleteOne(filter);

    if (session) {
      query.session(session);
    }

    const result = await query;
    return result.deletedCount > 0;
  }

  public async deleteMany(options: deleteOptions<T>): Promise<boolean> {
    const { filter, session } = options;
    const query = this.model.deleteMany(filter);

    if (session) {
      query.session(session);
    }

    const result = await query;
    return result.deletedCount > 0;
  }
}
