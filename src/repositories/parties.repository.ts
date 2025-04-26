import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { Party } from '../models/interfaces/party';
import PartyModel from '../models/parties.model';
import { BaseRepository } from './base.repository';

export class PartyRepository extends BaseRepository<MongooseModel<Party>> {
  constructor(model: Model<MongooseModel<Party>>) {
    super(model);
  }

  async findByName(name: string): Promise<Party[]> {
    const result = await this.model.find({ $text: { $search: name } });
    return result ?? [];
  }
}

export const partyRepository = mongoService.createRepository(
  PartyRepository,
  PartyModel,
);
