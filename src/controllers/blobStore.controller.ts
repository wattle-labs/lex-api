import { Context } from 'hono';

import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { blobStoreService } from '../services/blobStore.service';
import { BlobStoreService } from '../services/blobStore.service';
import { ingestService } from '../services/ingest.service';
import { getSignedUrl } from '../utils/google-cloud';

export class BlobStoreController {
  constructor(protected readonly service: BlobStoreService) {}

  getUploadUrl = async (ctx: Context) => {
    try {
      // TODO: contentType needs to be used
      const { fileName, bucketName } = ctx.req.query();
      logger.debug(
        `Getting upload url for file ${fileName} in bucket ${bucketName}`,
      );
      const url = await this.service.getUploadUrl(fileName, bucketName);
      logger.debug(`Successfully got upload url`, { url });

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
  };

  runWorkflowForUpload = async (ctx: Context) => {
    try {
      const { fileName, bucketName, fileType } = await ctx.req.json();
      await ingestService.runPostUploadWorkflow(bucketName, fileName, fileType);
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
  };

  getSignedUrl = async (ctx: Context) => {
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
  };
}

export const blobStoreController = new BlobStoreController(blobStoreService);
