import { getSignedUrl } from '../utils/google-cloud';

/**
 * IngestService
 *
 * This service is responsible for ingesting files into the database.
 * It is responsible for uploading files to the storage bucket and creating a new contract in the database.
 *
 * @TODO: Create a new storage bucket for new organizations and use that bucket for all ingestion
 *
 */
export class BlobStoreService {
  /**
   * Get a signed URL for UPLOADING a file to Google Cloud Storage
   *
   * @param fileName - The name of the file
   * @param bucketName - The name of the bucket
   * @param contentType - The content type of the file
   * @returns The signed URL
   */
  async getUploadUrl(
    fileName: string,
    bucketName: string = 'contracts-default',
  ) {
    return getSignedUrl(fileName, bucketName, 'write', 60);
  }

  /**
   * Get a signed URL for DOWNLOADING a file from Google Cloud Storage
   *
   * @param fileName - The name of the file
   * @param bucketName - The name of the bucket
   * @returns The signed URL
   */
  async getDownloadUrl(
    fileName: string,
    bucketName: string = 'contracts-default',
    expirationInMinutes: number = 60,
  ) {
    return getSignedUrl(fileName, bucketName, 'read', expirationInMinutes);
  }
}

// singleton
export const blobStoreService = new BlobStoreService();
