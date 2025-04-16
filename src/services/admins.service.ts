import { Admin } from '../models/interfaces/admin';
import { MongooseModel } from '../models/interfaces/document.interface';
import { AdminRepository, adminRepository } from '../repositories';
import { BaseService } from './base.service';

export class AdminService extends BaseService<MongooseModel<Admin>> {
  private adminRepository: AdminRepository;

  constructor(repository: AdminRepository) {
    super(repository, 'admins');
    this.adminRepository = repository;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findByEmail(email);
  }
}

export const adminService = new AdminService(adminRepository);
