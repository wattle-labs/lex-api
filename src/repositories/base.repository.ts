import { Document, Model, UpdateQuery } from 'mongoose';

import {
  IRepository,
  countOptions,
  createOptions,
  deleteOptions,
  findAllOptions,
  findByBusinessIdOptions,
  findByIdOptions,
  findOneOptions,
  updateOptions,
} from '../interfaces/repository.interface';

export class BaseRepository<T> implements IRepository<T> {
  constructor(protected readonly model: Model<T & Document>) {}

  public async count({ filter }: countOptions<T>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  public async create({ data }: createOptions<T>): Promise<T> {
    const entity = await this.model.create(data);

    return entity.toObject() as T;
  }

  public async find({
    filter,
    fields,
    options,
    limit,
    skip,
    sort,
  }: findAllOptions<T>): Promise<T[]> {
    const result = await this.model
      .find(filter ?? {}, fields, options)
      .limit(limit ?? 10)
      .skip(skip ?? 0)
      .sort(sort);
    return result as T[];
  }

  public async findById({
    id,
    fields,
    options,
  }: findByIdOptions<T>): Promise<T | null> {
    const result = await this.model.findById(id, fields, options).lean();

    return result as T | null;
  }

  public async findOne({
    filter,
    fields,
    options,
  }: findOneOptions<T>): Promise<T | null> {
    const result = await this.model.findOne(filter, fields, options).lean();

    return result as T | null;
  }

  public async findByBusinessId({
    businessId,
    fields,
    options,
  }: findByBusinessIdOptions<T>): Promise<T | null> {
    const result = await this.model
      .findOne({ businessId }, fields, options)
      .lean();

    return result as T | null;
  }

  public async update({
    filter,
    update,
    options,
  }: updateOptions<T>): Promise<T | null> {
    const result = await this.model
      .findOneAndUpdate(filter, { $set: update } as UpdateQuery<T & Document>, {
        new: true,
        ...options,
      })
      .lean();

    return result as T | null;
  }

  public async delete({ filter }: deleteOptions<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filter);

    return result.deletedCount > 0;
  }
}
