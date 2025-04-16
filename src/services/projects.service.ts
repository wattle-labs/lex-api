import { MongooseModel } from '../models/interfaces/document.interface';
import { Project } from '../models/interfaces/project';
import {
  ProjectRepository,
  projectRepository,
} from '../repositories/projects.repository';
import { BaseService } from './base.service';

export class ProjectService extends BaseService<MongooseModel<Project>> {
  private projectRepository: ProjectRepository;

  constructor(repository: ProjectRepository) {
    super(repository, 'project');
    this.projectRepository = repository;
  }

  async findByOrganization(businessId: string): Promise<Project[]> {
    return await this.projectRepository.findByOrganization(businessId);
  }

  async findActiveProjects(businessId: string): Promise<Project[]> {
    return await this.projectRepository.findActiveProjects(businessId);
  }

  async findByOwner(ownerId: string): Promise<Project[]> {
    return await this.projectRepository.findByOwner(ownerId);
  }

  async findByType(businessId: string, type: string): Promise<Project[]> {
    return await this.projectRepository.findByType(businessId, type);
  }

  async findByDepartment(
    businessId: string,
    department: string,
  ): Promise<Project[]> {
    return await this.projectRepository.findByDepartment(
      businessId,
      department,
    );
  }
}

export const projectService = new ProjectService(projectRepository);
