import { FilterQuery, Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { Project } from '../models/interfaces/project';
import ProjectModel from '../models/projects.model';
import { BaseRepository } from './base.repository';

export class ProjectRepository extends BaseRepository<MongooseModel<Project>> {
  constructor(model: Model<MongooseModel<Project>>) {
    super(model);
  }

  async findByOrganization(businessId: string): Promise<Project[]> {
    const results = await this.find({
      filter: { businessId } as FilterQuery<MongooseModel<Project>>,
    });
    return results;
  }

  async findActiveProjects(businessId: string): Promise<Project[]> {
    const results = await this.find({
      filter: {
        businessId,
        status: 'active',
      } as FilterQuery<MongooseModel<Project>>,
    });
    return results;
  }

  async findByOwner(ownerId: string): Promise<Project[]> {
    const results = await this.find({
      filter: {
        'ownership.primaryOwnerId': ownerId,
      } as FilterQuery<MongooseModel<Project>>,
    });
    return results;
  }

  async findByType(businessId: string, type: string): Promise<Project[]> {
    const results = await this.find({
      filter: {
        businessId,
        type,
      } as FilterQuery<MongooseModel<Project>>,
    });
    return results;
  }

  async findByDepartment(
    businessId: string,
    department: string,
  ): Promise<Project[]> {
    const results = await this.find({
      filter: {
        businessId,
        'metadata.department': department,
      } as FilterQuery<MongooseModel<Project>>,
    });
    return results;
  }

  async findUpcomingDeadlines(days: number = 7): Promise<Project[]> {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + days);

    const results = await this.find({
      filter: {
        'dates.dueDate': {
          $gte: today,
          $lte: future,
        },
        status: 'active',
      } as unknown as FilterQuery<MongooseModel<Project>>,
    });
    return results;
  }
}

export const projectRepository = mongoService.createRepository(
  ProjectRepository,
  ProjectModel,
);
