import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document';
import { User } from '../models/interfaces/user';
import UserModel from '../models/users.model';
import { BaseRepository } from './base.repository';

export class UsersRepository extends BaseRepository<MongooseModel<User>> {
  constructor(model: Model<MongooseModel<User>>) {
    super(model);
  }

  async findByClerkId(clerkId: string): Promise<MongooseModel<User> | null> {
    return this.model.findOne(
      {
        externalId: clerkId,
      },
      null,
      {
        populate: {
          path: 'viewIds',
          model: 'View',
          select: 'name',
        },
      },
    );
  }

  async findByEmail(email: string): Promise<MongooseModel<User> | null> {
    return this.model.findOne({ email });
  }
}

export const usersRepository = mongoService.createRepository(
  UsersRepository,
  UserModel,
);
