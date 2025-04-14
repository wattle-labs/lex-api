import { Context } from 'hono';
import { Document } from 'mongoose';

import {
  VALIDATION_MIDDLEWARE_KEY,
  VALIDATION_TARGETS,
} from '../constants/validation.constants';
import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { BaseService } from '../services/base.service';
import { FindOptionsType } from '../types/pagination.types';

export class BaseController<T extends Document, S extends BaseService<T>> {
  protected service: S;
  protected resourceName: string;

  constructor(service: S, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  findById = async (ctx: Context): Promise<Response> => {
    const { id } = ctx.get(
      `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
    );
    try {
      const resource = await this.service.findById(id);

      if (!resource) {
        logger.warn(`${this.resourceName} not found`, { id });
        return ctx.json(
          ResponseBuilder.notFound(`${this.resourceName} not found`),
          404,
        );
      }

      return ctx.json(ResponseBuilder.success(resource), 200);
    } catch (error) {
      logger.error(
        `Failed to get ${this.resourceName}`,
        { id },
        error instanceof Error ? error : new Error(String(error)),
      );
      const message =
        error instanceof Error
          ? error.message
          : `Failed to get ${this.resourceName}`;

      return ctx.json(ResponseBuilder.serverError(message), 500);
    }
  };

  findAll = async (ctx: Context): Promise<Response> => {
    try {
      const queryParams = ctx.get(
        `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.QUERY}`,
      );
      const { page, pageSize, sortBy, sortOrder }: FindOptionsType =
        queryParams;

      const resources = await this.service.findAll({
        options: { page, pageSize, sortBy, sortOrder },
      });
      return ctx.json(ResponseBuilder.success(resources), 200);
    } catch (error) {
      logger.error(`Failed to get all ${this.resourceName}`, { error });
      return ctx.json(
        ResponseBuilder.serverError(`Failed to get all ${this.resourceName}`),
        500,
      );
    }
  };

  findByBusinessId = async (ctx: Context): Promise<Response> => {
    try {
      const resources = await this.service.findByBusinessId(
        ctx.req.param('businessId'),
      );
      return ctx.json(ResponseBuilder.success(resources), 200);
    } catch (error) {
      logger.error(`Failed to get ${this.resourceName} by business ID`, {
        error,
      });
      return ctx.json(
        ResponseBuilder.serverError(
          `Failed to get ${this.resourceName} by business ID`,
        ),
        500,
      );
    }
  };

  create = async (ctx: Context): Promise<Response> => {
    try {
      const data = await ctx.req.json();
      const resource = await this.service.create(data);
      return ctx.json(ResponseBuilder.created(resource), 201);
    } catch (error) {
      logger.error(`Failed to create ${this.resourceName}`, {
        error,
      });
      return ctx.json(
        ResponseBuilder.serverError(`Failed to create ${this.resourceName}`),
        500,
      );
    }
  };

  update = async (ctx: Context): Promise<Response> => {
    try {
      const { id } = ctx.get(
        `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
      );
      const data = await ctx.req.json();
      const resource = await this.service.updateById(id, data);

      if (!resource) {
        return ctx.json(
          ResponseBuilder.notFound(`${this.resourceName} not found`),
          404,
        );
      }

      return ctx.json(ResponseBuilder.success(resource), 200);
    } catch (error) {
      logger.error(`Failed to update ${this.resourceName}`, {
        error,
      });
      return ctx.json(
        ResponseBuilder.serverError(`Failed to update ${this.resourceName}`),
        500,
      );
    }
  };

  delete = async (ctx: Context): Promise<Response> => {
    try {
      const { id } = ctx.get(
        `${VALIDATION_MIDDLEWARE_KEY}:${VALIDATION_TARGETS.PARAMS}`,
      );
      const resource = await this.service.deleteById(id);

      if (!resource) {
        return ctx.json(
          ResponseBuilder.notFound(`${this.resourceName} not found`),
          404,
        );
      }

      return ctx.json(ResponseBuilder.success(resource), 200);
    } catch (error) {
      logger.error(`Failed to delete ${this.resourceName}`, {
        error,
      });
      return ctx.json(
        ResponseBuilder.serverError(`Failed to delete ${this.resourceName}`),
        500,
      );
    }
  };
}
