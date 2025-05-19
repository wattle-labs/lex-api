import { createRoute, z } from '@hono/zod-openapi';

import { IngestController } from '../controllers/ingest.controller';
import { BaseRoutes } from './base.routes';

export class IngestRoutes extends BaseRoutes {
  PATH = '/upload';

  protected RESOURCE_NAME = 'upload-file';

  constructor(protected readonly ingestController: IngestController) {
    super();
    this.setupRoutes();
  }

  protected setupRoutes(): void {
    const routes = [
      {
        route: createRoute({
          method: 'get',
          path: '/get-signed-url',
          summary: 'Get signed URL for GCS',
          tags: [this.RESOURCE_NAME],
          request: {
            query: z
              .object({
                fileName: z.string(),
                bucketName: z.string(),
                mode: z
                  .enum(['upload', 'download'])
                  .default('download')
                  .optional(),
                contentType: z.string().optional(),
                cleanedFileName: z.string().optional(),
              })
              .transform(data => {
                if (data.mode === 'upload') {
                  return {
                    ...data,
                    contentType: data.contentType ?? 'application/octet-stream',
                  };
                }
                return data;
              }),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: z.object({
                    url: z.string(),
                  }),
                },
              },
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: z.object({
                    error: z.string(),
                  }),
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: z.object({
                    error: z.string(),
                  }),
                },
              },
            },
          },
        }),
        handler: this.ingestController.getSignedUrl,
      },
      {
        route: createRoute({
          method: 'post',
          path: '/process',
          summary: 'Run workflow for contract ingestion after uploading a file',
          tags: [this.RESOURCE_NAME],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: z.object({
                    fileName: z.string(),
                    bucketName: z.string(),
                    businessId: z.string().optional(),
                  }),
                },
              },
              description:
                'The fileName, bucketName, and businessId to process',
              required: true,
            },
          },
          responses: {
            '201': {
              description: 'Successful response',
              content: {},
            },
            '400': {
              description: 'Bad request',
              content: {},
            },
            '500': {
              description: 'Internal server error',
              content: {},
            },
          },
        }),
        handler: this.ingestController.runPostUploadWorkflow,
      },
    ];

    routes.forEach(({ route, handler }) => {
      this.registerRoute(route, handler);
    });
  }
}
