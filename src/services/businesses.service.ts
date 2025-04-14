import { Business } from '../models/interfaces/business';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BusinessRepository, businessRepository } from '../repositories';
import { BaseService } from './base.service';

export class BusinessService extends BaseService<MongooseModel<Business>> {
  private businessRepository: BusinessRepository;

  constructor(repository: BusinessRepository) {
    super(repository, 'business');
    this.businessRepository = repository;
  }

  async findBySlug(slug: string): Promise<Business | null> {
    return await this.businessRepository.findOne({ filter: { slug } });
  }
}

export const businessService = new BusinessService(businessRepository);
