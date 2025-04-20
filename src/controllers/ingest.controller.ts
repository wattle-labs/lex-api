import { Context } from 'hono';

import { logger } from '../lib/logger';
import { ResponseBuilder } from '../lib/response.handler';
import { IngestService, ingestService } from '../services/ingest.service';

export class IngestController {
  constructor(protected readonly service: IngestService) {}

  runPostUploadWorkflow = async (ctx: Context) => {
    try {
      const { fileName, bucketName, businessId } = await ctx.req.json();
      await this.service.runPostUploadWorkflow(
        bucketName,
        fileName,
        businessId,
      );
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
      const {
        fileName,
        bucketName,
        mode,
        contentType,
        cleanedFileName,
        expirationInMinutes,
      } = ctx.req.query();
      const url = await this.service.getSignedUrl(
        fileName,
        bucketName,
        mode as 'upload' | 'download',
        expirationInMinutes ? parseInt(expirationInMinutes) : undefined,
        cleanedFileName,
        contentType,
      );
      logger.debug(`Successfully got signed url for ${mode}: `, { url });
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

export const ingestController = new IngestController(ingestService);
