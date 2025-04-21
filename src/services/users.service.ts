import { User as ClerkUser } from '@clerk/express';

import { SYSTEM_ROLE_ASSIGMENT } from '../constants/api.constants';
import { NotFoundError } from '../lib/errors.handler';
import { logger } from '../lib/logger';
import { MongooseModel } from '../models/interfaces/document.interface';
import { User } from '../models/interfaces/user';
import { businessRepository } from '../repositories/businesses.repository';
import { invitationRepository } from '../repositories/invitations.repository';
import {
  UserRepository,
  userRepository,
} from '../repositories/users.repository';
import { BaseService } from './base.service';

export class UsersService extends BaseService<MongooseModel<User>> {
  private userRepository: UserRepository;

  constructor(repository: UserRepository) {
    super(repository, 'user');
    this.userRepository = repository;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findByExternalId(externalId: string): Promise<User | null> {
    return await this.userRepository.findByExternalId(externalId);
  }

  async findUsersByBusiness(businessId: string): Promise<User[]> {
    return await this.userRepository.findUsersByBusiness(businessId);
  }

  async findUsersByManager(managerId: string): Promise<User[]> {
    return await this.userRepository.findUsersByManager(managerId);
  }

  async acceptInvitation(
    invitationId: string,
    externalUser: ClerkUser,
  ): Promise<User | null> {
    const email = externalUser.primaryEmailAddress?.emailAddress;

    if (!email) {
      throw new NotFoundError('Email not found');
    }

    const invitation = await invitationRepository.findOne({
      filter: { _id: invitationId, email, status: 'pending' },
    });

    if (!invitation) {
      logger.error('Invitation not found', { invitationId, email });

      throw new NotFoundError('Invitation not found');
    }

    const user = await this.userRepository.acceptInvitation(
      invitation,
      externalUser,
    );

    if (!user) {
      logger.error('User not created', { email });

      throw new NotFoundError('Could not create user');
    }

    logger.info('User created', { userId: user?.id });

    await invitationRepository.update({
      filter: { _id: invitationId },
      update: { status: 'accepted' },
    });

    logger.info('Invitation updated', {
      invitationId,
      status: 'accepted',
    });

    await businessRepository.update({
      filter: {
        _id: invitation.businessId,
        'setup.status': 'pending',
      },
      update: {
        'setup.status': 'completed',
      },
      push: { 'setup.completedSteps': 'owner_invitation_accepted' },
    });

    logger.info('Business updated', {
      businessId: invitation.businessId,
      status: 'completed',
    });

    await this.assignRoleToUser(
      invitation.businessId.toString(),
      user.id as string,
      invitation.assignment?.roleTemplateId?.toString() ?? '',
      SYSTEM_ROLE_ASSIGMENT,
    );

    return user;
  }
}

export const usersService = new UsersService(userRepository);
