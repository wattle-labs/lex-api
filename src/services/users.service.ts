import { MongooseModel } from '../models/interfaces/document.interface';
import { User } from '../models/interfaces/user';
import {
  UserRepository,
  userRepository,
} from '../repositories/users.repository';
import { BaseService } from './base.service';

export class UserService extends BaseService<MongooseModel<User>> {
  private userRepository: UserRepository;

  constructor(repository: UserRepository) {
    super(repository, 'user');
    this.userRepository = repository;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findByExternalId(externalId: string): Promise<User | null> {
    return await this.userRepository.findByExternalId(externalId);
  }

  async findUsersByBusiness(businessId: string): Promise<User[]> {
    return await this.userRepository.findUsersByBusiness(businessId);
  }

  async findUsersByManager(managerId: string): Promise<User[]> {
    return await this.userRepository.findUsersByManager(managerId);
  }
}

export const userService = new UserService(userRepository);
