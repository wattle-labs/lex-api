import { ClauseDefinition } from '../models/interfaces/clauseDefinition';
import { MongooseModel } from '../models/interfaces/document.interface';
import {
  ClauseDefinitionRepository,
  clauseDefinitionRepository,
} from '../repositories';
import { BaseService } from './base.service';

export class ClauseDefinitionService extends BaseService<
  MongooseModel<ClauseDefinition>
> {
  constructor(repository: ClauseDefinitionRepository) {
    super(repository, 'clauseDefinition');
  }

  async initialize(): Promise<void> {
    return await (this.repository as ClauseDefinitionRepository).initialize();
  }
}

export const clauseDefinitionService = new ClauseDefinitionService(
  clauseDefinitionRepository,
);
