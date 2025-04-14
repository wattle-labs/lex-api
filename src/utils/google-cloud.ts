import { Storage, TransferManager } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

import { logger } from '../lib/logger';

dotenv.config();

/**
 * Uploads a file to Google Cloud Storage using a streaming upload
 *
 * @param fileBytes - The file to upload
 * @param fileName - The name of the file
 * @param bucketName - The name of the bucket
 * @returns The URL of the uploaded file
 */
export const streamingUpload = async (
  fileBytes: Buffer | string,
  fileName: string,
  bucketName: string = 'contracts-default',
) => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  try {
    await pipeline(Readable.from(fileBytes), file.createWriteStream());
    const [url] = await file.getSignedUrl({
      expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      action: 'read',
    });
    return url;
  } catch (error) {
    logger.error('Error uploading file to Google Cloud Storage', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fileName,
      bucketName,
    });
    throw error;
  }
};

/**
 * Uploads a file to Google Cloud Storage using a transfer manager
 *
 * @param fileBytes - The file to upload
 * @param fileName - The name of the file
 * @param bucketName - The name of the bucket
 * @returns The URL of the uploaded file
 */
export const transferManagerUpload = async (
  filePath: string,
  bucketName: string = 'contracts-default',
) => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const fileName = path.basename(filePath);
  const file = bucket.file(fileName);
  const transferManager = new TransferManager(bucket);

  try {
    await transferManager.uploadFileInChunks(filePath, {
      chunkSizeBytes: 1024 * 1024 * 3, // 3MB
      uploadName: fileName,
    });
    const [url] = await file.getSignedUrl({
      expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      action: 'read',
    });

    return url;
  } catch (error) {
    logger.error('Error uploading file to Google Cloud Storage', {
      error: error instanceof Error ? error.message : 'Unknown error',
      filePath,
      bucketName,
    });
    throw error;
  }
};

/**
 * Gets a signed URL for a file in Google Cloud Storage
 *
 * @deprecated Use getSignedUrl instead
 *
 * @param fileName - The name of the file
 * @param bucketName - The name of the bucket
 * @param action - The action to perform on the file
 * @param expiresInMinutes - The number of minutes the URL will be valid
 * @param contentType - The content type of the file
 * @returns The signed URL
 */
export const DO_NOT_USE__getSignedUrl = async (
  fileName: string,
  bucketName: string = 'contracts-default',
  action: 'read' | 'write' | 'delete' = 'read',
  expiresInMinutes: number = 15,
  contentType: string = 'application/pdf',
) => {
  const storage = new Storage();
  const bucket = storage.bucket(decodeURIComponent(bucketName));
  const file = bucket.file(decodeURIComponent(fileName));
  const [url] = await file.getSignedUrl({
    version: 'v4',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
    action,
    contentType,
  });
  return url;
};

/**
 * Gets a new signed URL for a file in Google Cloud Storage
 *
 * @param fileName - The name of the file
 * @param bucketName - The name of the bucket
 * @param action - The action to perform on the file
 * @param expiresInMinutes - The number of minutes the URL will be valid (default: 60)
 * @returns The signed URL
 */
export const getSignedUrl = async (
  fileName: string,
  bucketName: string = 'contracts-default',
  action: 'read' | 'write' | 'delete' = 'read',
  expiresInMinutes: number = 60,
): Promise<string | null> => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);
  try {
    const [url] = await file.getSignedUrl({
      expires: Date.now() + expiresInMinutes * 60 * 1000,
      action,
    });
    return url;
  } catch (error) {
    logger.error('Error getting new signed URL for Google Cloud Storage', {
      error: error instanceof Error ? error.message : 'Unknown error',
      fileName,
      bucketName,
    });
    return null;
  }
};
