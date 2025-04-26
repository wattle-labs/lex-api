import { MongooseModel } from '../models/interfaces/document';
import { Party } from '../models/interfaces/party';
import { PartyRepository, partyRepository } from '../repositories';
import { BaseService } from './base.service';

export class PartyService extends BaseService<MongooseModel<Party>> {
  constructor(repository: PartyRepository) {
    super(repository, 'party');
  }

  async findByName(name: string): Promise<Party[]> {
    const repository = this.repository as PartyRepository;
    return await repository.findByName(name);
  }
}

export const partyService = new PartyService(partyRepository);
