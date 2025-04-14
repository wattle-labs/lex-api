import { createRoute, z } from '@hono/zod-openapi';

import { BlobStoreController } from '../controllers/blobStore.controller';
import { BaseRoutes } from './base.routes';

export class BlobStoreRoutes extends BaseRoutes {
  PATH = '/upload';

  protected RESOURCE_NAME = 'uploadFile';

  constructor(protected readonly blobStoreController: BlobStoreController) {
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
          tags: [this.RESOURCE_NAME, 'getSignedUrl'],
          request: {
            query: z.object({
              fileName: z.string(),
              bucketName: z.string(),
              mode: z.enum(['upload', 'download']).default('download'),
              contentType: z.string().optional(),
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
        handler: this.blobStoreController.getUploadUrl,
      },
      {
        route: createRoute({
          method: 'get',
          path: '/get-new-url',
          summary: 'Get new signed URL for GCS',
          tags: [this.RESOURCE_NAME, 'getNewSignedUrl'],
          request: {
            query: z.object({
              fileName: z.string(),
              bucketName: z.string(),
            }),
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {},
            },
            '400': {
              description: 'Bad request',
              content: {
                'application/json': {
                  schema: z.any(),
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: z.any(),
                },
              },
            },
          },
        }),
        handler: this.blobStoreController.getSignedUrl,
      },
      {
        route: createRoute({
          method: 'post',
          path: '/process',
          summary: 'Run workflow for contract ingestion when uploading a file',
          tags: [this.RESOURCE_NAME, 'runWorkflowForUpload'],
          request: {
            body: {
              content: {
                'application/json': {
                  schema: z.object({
                    fileName: z.string(),
                    bucketName: z.string(),
                  }),
                },
              },
              description: 'The fileName and bucketName to process',
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
        handler: this.blobStoreController.runWorkflowForUpload,
      },
    ];

    routes.forEach(({ route, handler }) => {
      this.registerRoute(route, handler);
    });
  }
}
