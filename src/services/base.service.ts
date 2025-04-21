import { FilterQuery } from 'mongoose';

import { QUERY_CONFIG } from '../config/api.config';
import { SORT_ORDER } from '../constants/request.constants';
import { IRepository } from '../interfaces/repository.interface';
import { logger } from '../lib/logger';
import { userRoleTemplateRepository } from '../repositories/userRoleTemplates.repository';
import { userRoleRepository } from '../repositories/userRoles.repository';
import { FindOptionsType } from '../types/pagination.types';

export abstract class BaseService<T> {
  protected repository: IRepository<T>;
  protected resourceName: string;

  constructor(repository: IRepository<T>, resourceName: string) {
    this.repository = repository;
    this.resourceName = resourceName;
  }

  protected buildSortObject(options?: FindOptionsType): Record<string, 1 | -1> {
    if (!options?.sortBy) return {};

    return {
      [options.sortBy]: options.sortOrder === SORT_ORDER.DESC ? -1 : 1,
    };
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.repository.findOne({ filter });
    } catch (error) {
      logger.error(`Error finding ${this.resourceName}`, { error });
      throw error;
    }
  }

  async findAll({ options }: { options: FindOptionsType }): Promise<T[]> {
    try {
      const filter = {};
      const { page = 1, pageSize = QUERY_CONFIG.DEFAULT_PAGE_SIZE } =
        options ?? {};
      const skip = (page - 1) * pageSize;
      const sort = this.buildSortObject(options);

      return await this.repository.find({
        filter,
        skip,
        limit: pageSize,
        sort,
      });
    } catch (error) {
      logger.error(`Error finding ${this.resourceName}s`, { error });
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const document = await this.repository.findById({ id });
      if (!document) {
        logger.warn(`${this.resourceName} not found with ID: ${id}`);
        return null;
      }
      return document;
    } catch (error) {
      logger.error(`Error getting ${this.resourceName} by ID: ${id}`, {
        error,
      });
      throw error;
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const newDocument = await this.repository.create({ data });
      logger.info(`Created ${this.resourceName}`);
      return newDocument;
    } catch (error) {
      logger.error(`Error creating ${this.resourceName}`, { error });
      throw error;
    }
  }

  async updateById(id: string, update: Partial<T>): Promise<T | null> {
    try {
      const updatedDocument = await this.repository.update({
        filter: { _id: id } as unknown as FilterQuery<T>,
        update,
      });
      if (!updatedDocument) {
        logger.warn(`${this.resourceName} not found with ID: ${id}`);
        return null;
      }
      return updatedDocument;
    } catch (error) {
      logger.error(`Error updating ${this.resourceName} by ID: ${id}`, {
        error,
      });
      throw error;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      return await this.repository.delete({
        filter: { _id: id } as FilterQuery<T>,
      });
    } catch (error) {
      logger.error(`Error deleting ${this.resourceName} by ID: ${id}`, {
        error,
      });
      throw error;
    }
  }

  async assignRoleToUser(
    businessId: string,
    userId: string,
    roleTemplateId: string,
    assignedBy: string,
  ): Promise<void> {
    const userRoleTemplate = await userRoleTemplateRepository.findOne({
      filter: {
        _id: roleTemplateId,
        businessId,
      },
    });

    if (!userRoleTemplate) {
      throw new Error('User role template not found');
    }

    await userRoleRepository.create({
      data: {
        userId,
        businessId,
        userRoleTemplateId: userRoleTemplate._id,
        assignedBy,
      },
    });
  }
}
