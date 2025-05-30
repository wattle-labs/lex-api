import { User as ClerkUser } from '@clerk/express';
import { Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { Invitation } from '../models/interfaces/invitation';
import { User } from '../models/interfaces/user';
import UserModel from '../models/users.model';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<MongooseModel<User>> {
  constructor(model: Model<MongooseModel<User>>) {
    super(model);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.findOne({ filter: { email } });
    return result;
  }

  async findByExternalId(externalId: string): Promise<User | null> {
    const result = await this.findOne({
      filter: { externalId },
      options: { populate: ['viewIds'] },
    });
    return result;
  }

  async findUserByBusiness(
    userId: string,
    businessId: string,
  ): Promise<User | null> {
    const user = await this.findOne({
      filter: { _id: userId, businessId, status: 'active' },
    });

    return user;
  }

  async findUsersByManager(managerId: string): Promise<User[]> {
    const results = await this.find({
      filter: { 'hierarchy.managerId': managerId },
    });

    return results;
  }

  async acceptInvitation(
    invitation: Invitation,
    externalUser: ClerkUser,
  ): Promise<User | null> {
    const userData = {
      externalId: externalUser.id,
      email: invitation.email,
      businessId: invitation.businessId,
      status: 'active',
      onboarding: {
        completedAt: new Date(),
        invitationId: invitation.id,
        isBusinessOwner: invitation.role === 'owner',
      },
      profile: {
        firstName: externalUser.firstName,
        lastName: externalUser.lastName,
      },
      authProvider: {
        provider: 'clerk',
        lastLogin: new Date(),
        metadata: {
          clerkId: externalUser.id,
        },
      },
    };

    const user = await this.create({
      data: userData as Partial<MongooseModel<User>>,
    });

    return user;
  }
}

export const userRepository = mongoService.createRepository(
  UserRepository,
  UserModel,
);
