import { Business } from '../models/interfaces/business';
import { MongooseModel } from '../models/interfaces/document.interface';
import {
  BusinessRepository,
  businessRepository,
} from '../repositories/businesses.repository';
import { BaseService } from './base.service';

export class BusinessService extends BaseService<MongooseModel<Business>> {
  private businessRepository: BusinessRepository;

  constructor(repository: BusinessRepository) {
    super(repository, 'business');
    this.businessRepository = repository;
  }

  async findBySlug(slug: string): Promise<Business | null> {
    return await this.businessRepository.findBySlug(slug);
  }

  async findBusinessesByDomain(domain: string): Promise<Business[]> {
    return await this.businessRepository.findBusinessesByDomain(domain);
  }
}

export const businessService = new BusinessService(businessRepository);
