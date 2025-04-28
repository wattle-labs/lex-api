import { MongooseModel } from '../models/interfaces/document';
import { User } from '../models/interfaces/user';
import { UsersRepository } from '../repositories';
import { usersRepository } from '../repositories/users.repository';
import { BaseService } from './base.service';

export class UserService extends BaseService<MongooseModel<User>> {
  private usersRepository: UsersRepository;

  constructor(repository: UsersRepository) {
    super(repository, 'user');
    this.usersRepository = repository;
  }

  async findByClerkId(clerkId: string): Promise<MongooseModel<User> | null> {
    return this.usersRepository.findByClerkId(clerkId);
  }

  async findByEmail(email: string): Promise<MongooseModel<User> | null> {
    return this.usersRepository.findByEmail(email);
  }
}

export const userService = new UserService(usersRepository);
