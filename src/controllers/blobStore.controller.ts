import { Context } from 'hono';

import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { blobStoreService } from '../services/blobStore.service';
import { BlobStoreService } from '../services/blobStore.service';
import { ingestService } from '../services/ingest.service';
import { getSignedUrl } from '../utils/google-cloud';

export class BlobStoreController {
  constructor(protected readonly service: BlobStoreService) {}

  async getUploadUrl(ctx: Context) {
    try {
      // TODO: contentType needs to be used
      const { fileName, bucketName } = ctx.req.query();
      const url = await this.service.getUploadUrl(fileName, bucketName);

      return ctx.json(ResponseBuilder.success({ url }), 200);
    } catch (error) {
      logger.error(`Failed to get signed url`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return ctx.json(
        ResponseBuilder.serverError(`Failed to get signed url`),
        500,
      );
    }
  }

  async runWorkflowForUpload(ctx: Context) {
    try {
      const { fileName, bucketName, fileType } = await ctx.req.json();
      await ingestService.runWorkflowForUpload(bucketName, fileName, fileType);
      return ctx.json(ResponseBuilder.success(null), 201);
    } catch (error) {
      logger.error(`Failed to run workflow for upload`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return ctx.json(
        ResponseBuilder.serverError(`Failed to run workflow for upload`),
        500,
      );
    }
  }

  async getSignedUrl(ctx: Context) {
    try {
      const { fileName, bucketName } = ctx.req.query();
      const url = await getSignedUrl(fileName, bucketName);
      return ctx.json(ResponseBuilder.success({ url }), 200);
    } catch (error) {
      logger.error(`Failed to get signed url`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return ctx.json(
        ResponseBuilder.serverError(`Failed to get signed url`),
        500,
      );
    }
  }
}

export const blobStoreController = new BlobStoreController(blobStoreService);
