import { FilterQuery, Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ProjectAccess } from '../models/interfaces/projectAccess';
import ProjectAccessModel from '../models/projectAccess.model';
import { BaseRepository } from './base.repository';

export class ProjectAccessRepository extends BaseRepository<
  MongooseModel<ProjectAccess>
> {
  constructor(model: Model<MongooseModel<ProjectAccess>>) {
    super(model);
  }

  async findByProject(projectId: string): Promise<ProjectAccess[]> {
    const results = await this.find({
      filter: { projectId } as FilterQuery<MongooseModel<ProjectAccess>>,
    });
    return results;
  }

  async findByUser(userId: string): Promise<ProjectAccess[]> {
    const results = await this.find({
      filter: { userId } as FilterQuery<MongooseModel<ProjectAccess>>,
    });
    return results;
  }

  async findByUserAndProject(
    userId: string,
    projectId: string,
  ): Promise<ProjectAccess | null> {
    const result = await this.findOne({
      filter: {
        userId,
        projectId,
      } as FilterQuery<MongooseModel<ProjectAccess>>,
    });
    return result;
  }

  async findExpiredAccess(): Promise<ProjectAccess[]> {
    const results = await this.find({
      filter: {
        'constraints.expiresAt': { $lt: new Date() },
      } as FilterQuery<MongooseModel<ProjectAccess>>,
    });
    return results;
  }

  async findByAccessType(
    projectId: string,
    accessType: string,
  ): Promise<ProjectAccess[]> {
    const results = await this.find({
      filter: {
        projectId,
        accessTypes: accessType,
      } as FilterQuery<MongooseModel<ProjectAccess>>,
    });
    return results;
  }

  async findAdmins(projectId: string): Promise<ProjectAccess[]> {
    return this.findByAccessType(projectId, 'admin');
  }
}

export const projectAccessRepository = mongoService.createRepository(
  ProjectAccessRepository,
  ProjectAccessModel,
);
