import { FilterQuery, Model } from 'mongoose';

import { mongoService } from '../lib/mongo';
import { MongooseModel } from '../models/interfaces/document.interface';
import { Invitation } from '../models/interfaces/invitation';
import InvitationModel from '../models/invitations.model';
import { BaseRepository } from './base.repository';

export class InvitationRepository extends BaseRepository<
  MongooseModel<Invitation>
> {
  constructor(model: Model<MongooseModel<Invitation>>) {
    super(model);
  }

  async findByEmail(email: string, businessId?: string): Promise<Invitation[]> {
    const results = await this.find({
      filter: { email, businessId } as FilterQuery<MongooseModel<Invitation>>,
    });
    return results;
  }

  async findPendingByEmail(
    email: string,
    businessId: string,
  ): Promise<Invitation | null> {
    const result = await this.findOne({
      filter: {
        email,
        businessId,
        status: 'pending',
      } as FilterQuery<MongooseModel<Invitation>>,
    });
    return result;
  }

  async findByToken(token: string): Promise<Invitation | null> {
    const result = await this.findOne({
      filter: {
        security: {
          token: token,
        },
      } as FilterQuery<MongooseModel<Invitation>>,
    });
    return result;
  }

  async findByTokenHash(tokenHash: string): Promise<Invitation | null> {
    const result = await this.findOne({
      filter: {
        security: {
          tokenHash,
        },
      } as FilterQuery<MongooseModel<Invitation>>,
    });
    return result;
  }

  async findExpiredInvitations(): Promise<Invitation[]> {
    const results = await this.find({
      filter: {
        status: 'pending',
        security: { expiresAt: { $lt: new Date() } },
      } as FilterQuery<MongooseModel<Invitation>>,
    });
    return results;
  }

  async findByBusiness(businessId: string): Promise<Invitation[]> {
    const results = await this.find({
      filter: { businessId } as FilterQuery<MongooseModel<Invitation>>,
    });
    return results;
  }

  async findByBusinessAndStatus(
    businessId: string,
    status: string,
  ): Promise<Invitation[]> {
    const results = await this.find({
      filter: { businessId, status } as FilterQuery<MongooseModel<Invitation>>,
    });
    return results;
  }

  async markAsExpired(id: string): Promise<Invitation | null> {
    return await this.update({
      filter: { _id: id } as FilterQuery<MongooseModel<Invitation>>,
      update: { status: 'expired' } as unknown as MongooseModel<Invitation>,
    });
  }

  async markAsAccepted(id: string): Promise<Invitation | null> {
    return await this.update({
      filter: { _id: id } as FilterQuery<MongooseModel<Invitation>>,
      update: {
        status: 'accepted',
        security: {
          usedAt: new Date(),
        },
      } as unknown as MongooseModel<Invitation>,
    });
  }

  generateToken(): { token: string; tokenHash: string } {
    return (this.model as typeof InvitationModel).generateToken();
  }
}

export const invitationRepository = mongoService.createRepository(
  InvitationRepository,
  InvitationModel,
);
