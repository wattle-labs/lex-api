import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import AuthProviderModel from '../models/authProviders.model';
import { AuthProvider } from '../models/interfaces/authProvider';
import { MongooseModel } from '../models/interfaces/document.interface';
import { BaseRepository } from './base.repository';

export class AuthProviderRepository extends BaseRepository<
  MongooseModel<AuthProvider>
> {
  constructor(model: Model<MongooseModel<AuthProvider>>) {
    super(model);
  }

  async findByProvider(provider: string): Promise<AuthProvider | null> {
    const result = await this.findOne({ filter: { provider } });
    return result;
  }
}

export const authProviderRepository = mongoService.createRepository(
  AuthProviderRepository,
  AuthProviderModel,
);
