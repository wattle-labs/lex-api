import {
  Document,
  FilterQuery,
  QueryOptions,
  SortOrder,
  UpdateQuery,
} from 'mongoose';

export type countOptions<T> = {
  filter?: FilterQuery<T & Document>;
};

export type createOptions<T> = {
  data: Partial<T>;
};

export type findAllOptions<T> = {
  filter?: FilterQuery<T & Document>;
  fields?: string | string[] | null;
  options?: QueryOptions<T> | null;
  limit?: number;
  skip?: number;
  sort?: Record<string, SortOrder> | null;
};

export type findByIdOptions<T> = {
  id: string;
  fields?: string | string[] | null;
  options?: QueryOptions<T> | null;
};

export type findOneOptions<T> = {
  filter: FilterQuery<T & Document>;
  fields?: string | string[] | null;
  options?: QueryOptions<T> | null;
};

export type findByBusinessIdOptions<T> = {
  businessId: string;
  fields?: string | string[] | null;
  options?: QueryOptions<T> | null;
};

export type updateOptions<T> = {
  filter: FilterQuery<T & Document>;
  update: UpdateQuery<T>;
  options?: QueryOptions<T> | null;
};

export type deleteOptions<T> = {
  filter: FilterQuery<T & Document>;
};

export interface IRepository<T> {
  count(options: countOptions<T>): Promise<number>;
  create(options: createOptions<T>): Promise<T>;
  find(options: findAllOptions<T>): Promise<T[]>;
  findOne(options: findOneOptions<T>): Promise<T | null>;
  findById(options: findByIdOptions<T>): Promise<T | null>;
  findByBusinessId(options: findByBusinessIdOptions<T>): Promise<T | null>;
  update(options: updateOptions<T>): Promise<T | null>;
  delete(options: deleteOptions<T>): Promise<boolean>;
}
