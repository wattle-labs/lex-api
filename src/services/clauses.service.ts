import { Clause } from '../models/interfaces/clause';
import { MongooseModel } from '../models/interfaces/document.interface';
import { ClauseRepository, clauseRepository } from '../repositories';
import { BaseService } from './base.service';

export class ClauseService extends BaseService<MongooseModel<Clause>> {
  constructor(repository: ClauseRepository) {
    super(repository, 'clause');
  }

  async initialize(): Promise<void> {
    return await (this.repository as ClauseRepository).initialize();
  }
}

export const clauseService = new ClauseService(clauseRepository);
