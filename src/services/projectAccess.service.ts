import { MongooseModel } from '../models/interfaces/document.interface';
import { ProjectAccess } from '../models/interfaces/projectAccess';
import {
  ProjectAccessRepository,
  projectAccessRepository,
} from '../repositories/projectAccess.repository';
import { BaseService } from './base.service';

export class ProjectAccessService extends BaseService<
  MongooseModel<ProjectAccess>
> {
  private projectAccessRepository: ProjectAccessRepository;

  constructor(repository: ProjectAccessRepository) {
    super(repository, 'projectAccess');
    this.projectAccessRepository = repository;
  }

  async findByProject(projectId: string): Promise<ProjectAccess[]> {
    return await this.projectAccessRepository.findByProject(projectId);
  }

  async findByUser(userId: string): Promise<ProjectAccess[]> {
    return await this.projectAccessRepository.findByUser(userId);
  }

  async findByUserAndProject(
    userId: string,
    projectId: string,
  ): Promise<ProjectAccess | null> {
    return await this.projectAccessRepository.findByUserAndProject(
      userId,
      projectId,
    );
  }

  async findExpiredAccess(): Promise<ProjectAccess[]> {
    return await this.projectAccessRepository.findExpiredAccess();
  }

  async findByAccessType(
    projectId: string,
    accessType: string,
  ): Promise<ProjectAccess[]> {
    return await this.projectAccessRepository.findByAccessType(
      projectId,
      accessType,
    );
  }

  async findAdmins(projectId: string): Promise<ProjectAccess[]> {
    return await this.projectAccessRepository.findAdmins(projectId);
  }

  async grantAccess(
    projectId: string,
    userId: string,
    businessId: string,
    accessTypes: string[],
    grantedBy: string,
    options?: {
      inherited?: boolean;
      reasonCode?: string;
      comment?: string;
      expiresAt?: Date;
      conditions?: Record<string, unknown>;
    },
  ): Promise<ProjectAccess | null> {
    const accessData: Partial<ProjectAccess> = {
      projectId,
      userId,
      businessId,
      accessTypes,
      inherited: options?.inherited || false,
      source: {
        grantedBy,
        grantedAt: new Date(),
        reasonCode: options?.reasonCode,
        comment: options?.comment,
      },
    };

    if (options?.expiresAt || options?.conditions) {
      accessData.constraints = {
        expiresAt: options.expiresAt,
        conditions: options.conditions,
      };
    }

    const existingAccess = await this.findByUserAndProject(userId, projectId);

    if (existingAccess) {
      return await this.updateById(existingAccess.id!.toString(), accessData);
    } else {
      return await this.create(accessData);
    }
  }

  async revokeAccess(projectId: string, userId: string): Promise<boolean> {
    const access = await this.findByUserAndProject(userId, projectId);

    if (!access) {
      return false;
    }

    return await this.repository.delete({
      filter: { _id: access.id },
    });
  }

  async updateAccessTypes(
    projectId: string,
    userId: string,
    accessTypes: string[],
    updatedBy: string,
  ): Promise<ProjectAccess | null> {
    const access = await this.findByUserAndProject(userId, projectId);

    if (!access) {
      return null;
    }

    return await this.updateById(access.id!.toString(), {
      accessTypes,
      source: {
        grantedBy: updatedBy,
        grantedAt: new Date(),
      },
    });
  }
}

export const projectAccessService = new ProjectAccessService(
  projectAccessRepository,
);
