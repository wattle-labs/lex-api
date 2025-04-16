import { AuthProvider } from '../models/interfaces/authProvider';
import { MongooseModel } from '../models/interfaces/document.interface';
import {
  AuthProviderRepository,
  authProviderRepository,
} from '../repositories/authProviders.repository';
import { BaseService } from './base.service';

export class AuthProviderService extends BaseService<
  MongooseModel<AuthProvider>
> {
  private authProviderRepository: AuthProviderRepository;

  constructor(repository: AuthProviderRepository) {
    super(repository, 'authProvider');
    this.authProviderRepository = repository;
  }

  async findByProvider(provider: string): Promise<AuthProvider | null> {
    return await this.authProviderRepository.findByProvider(provider);
  }
}

export const authProviderService = new AuthProviderService(
  authProviderRepository,
);
