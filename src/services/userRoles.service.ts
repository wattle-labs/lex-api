import { MongooseModel } from '../models/interfaces/document.interface';
import { UserRole } from '../models/interfaces/userRole';
import {
  UserRoleRepository,
  userRoleRepository,
} from '../repositories/userRoles.repository';
import { BaseService } from './base.service';

export class UserRoleService extends BaseService<MongooseModel<UserRole>> {
  private userRoleRepository: UserRoleRepository;

  constructor(repository: UserRoleRepository) {
    super(repository, 'userRole');
    this.userRoleRepository = repository;
  }

  async findByUserAndBusiness(
    userId: string,
    businessId: string,
  ): Promise<UserRole[]> {
    return await this.userRoleRepository.findByUserAndBusiness(
      userId,
      businessId,
    );
  }

  async findActiveRolesByUser(userId: string): Promise<UserRole[]> {
    return await this.userRoleRepository.findActiveRolesByUser(userId);
  }

  async findByRoleTemplate(roleTemplateId: string): Promise<UserRole[]> {
    return await this.userRoleRepository.findByRoleTemplate(roleTemplateId);
  }

  async findExpiredRoles(): Promise<UserRole[]> {
    return await this.userRoleRepository.findExpiredRoles();
  }
}

export const userRoleService = new UserRoleService(userRoleRepository);
