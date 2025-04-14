import { logger } from '../lib/logger';
import { Contract, ContractStatus } from '../models/interfaces/contract';
import {
  ContractRepository,
  businessRepository,
  contractRepository,
} from '../repositories';
import { getSignedUrl, streamingUpload } from '../utils/google-cloud';
import { BaseService } from './base.service';
import { QueueService } from './queue.service';

/**
 * IngestService
 *
 * This service is responsible for ingesting files into the database.
 * It is responsible for uploading files to the storage bucket and creating a new contract in the database.
 *
 * @TODO: Create a new storage bucket for new organizations and use that bucket for all ingestion
 *
 */

const DUMMY_BUSINESS_ID = '67fa7473915f6e5a31d8eed9';

export class IngestService extends BaseService<Contract> {
  constructor(repository: ContractRepository) {
    super(repository, 'contractIngestion');
  }

  /**
   * Upload a file to the storage bucket in chunks
   * Uses a streaming upload to upload the file to the storage bucket
   *
   * @param file - The file to upload
   * @param fileName - The name of the file
   * @param bucketName - The name of the bucket (should be businessId)
   * @returns The URL of the uploaded file
   */
  async uploadFile(
    file: Buffer,
    fileName: string,
    bucketName: string = 'contracts-default',
  ) {
    const url = await streamingUpload(file, fileName, bucketName);
    return {
      url,
      bucketName,
      fileName,
    };
  }

  /**
   * Create a new contract in the database with the uploaded URL
   *
   * @param url - The URL of the uploaded file
   * @param contractType - The type of contract
   * @param businessId - The ID of the business
   * @TODO: Make businessId a required field once that is implemented
   * @returns The created contract
   */
  async createContractRecord(
    fileName: string,
    bucketName: string,
    url: string,
    businessId: string,
  ) {
    const contract = await this.repository.create({
      data: {
        url,
        businessId,
        gsBucketName: bucketName,
        fileName,
        status: ContractStatus.PENDING,
      },
    });

    return contract;
  }

  /**
   * Ingest a contract from a file
   *
   * @param file - The file to ingest
   * @returns The contract
   */
  async sendContractToQueue(contract: Contract) {
    const payload = {
      id: contract.id,
      url: contract.url,
      contractType: contract.contractTypeId,
      businessId: contract.businessId,
    };

    const queue = new QueueService<Partial<Contract>>('contract-ingestion');
    return await queue.add('contract', payload);
  }

  /**
   * Run the workflow for contract ingestion when triggered via Webhook
   * 1. Upload the file to the storage bucket
   * 2. Create for some a new contract record in the database, including storage bucket URL
   * 3. Send the contract to the queue
   *
   * @param file - The file to ingest
   * @param fileName - The name of the file
   */
  async runWorkflowForTrigger(
    file: Buffer,
    fileName: string,
    businessId: string = DUMMY_BUSINESS_ID,
  ) {
    const business = await businessRepository
      .findById({ id: businessId })
      .then(business => business?.id);

    if (!business) {
      logger.error('Business not found');
      throw new Error('Business not found');
    }

    const { url, bucketName } = await this.uploadFile(file, fileName);
    const contract = await this.createContractRecord(
      fileName,
      bucketName,
      url,
      businessId,
    );
    const messageId = await this.sendContractToQueue(contract);
    logger.info(
      `Contract ${contract.id} sent to queue with message ID ${messageId}`,
    );
    return messageId;
  }

  /**
   * Run the workflow for contract ingestion when triggered via API
   * 1. Create a new contract record in the database
   * 2. Create a signed URL for the file
   * 3. Send the contract to the queue
   *
   * @param bucketName - The name of the bucket
   * @param fileName - The name of the file
   */
  async runWorkflowForUpload(
    bucketName: string,
    fileName: string,
    fileType: string,
    businessId: string = DUMMY_BUSINESS_ID,
  ) {
    const business = await businessRepository.findById({ id: businessId });
    if (!business) {
      logger.error('Business not found');
      throw new Error('Business not found');
    }

    const url = await getSignedUrl(fileName, bucketName, 'read', 527040); // 1 year read rights
    const contract = await this.createContractRecord(
      fileName,
      bucketName,
      url as string,
      businessId,
    );
    const messageId = await this.sendContractToQueue(contract);
    logger.info(
      `Contract ${contract.id} sent to queue with message ID ${messageId}`,
    );
    return messageId;
  }
}

export const ingestService = new IngestService(contractRepository);
