import { MongooseModel } from '../models/interfaces/document.interface';
import { Invitation } from '../models/interfaces/invitation';
import {
  InvitationRepository,
  invitationRepository,
} from '../repositories/invitations.repository';
import { BaseService } from './base.service';

export class InvitationService extends BaseService<MongooseModel<Invitation>> {
  private invitationRepository: InvitationRepository;

  constructor(repository: InvitationRepository) {
    super(repository, 'invitation');
    this.invitationRepository = repository;
  }

  async findByEmail(email: string, businessId?: string): Promise<Invitation[]> {
    return await this.invitationRepository.findByEmail(email, businessId);
  }

  async findPendingByEmail(
    email: string,
    businessId: string,
  ): Promise<Invitation | null> {
    return await this.invitationRepository.findPendingByEmail(
      email,
      businessId,
    );
  }
  async findByToken(token: string): Promise<Invitation | null> {
    return await this.invitationRepository.findByToken(token);
  }

  async findByTokenHash(tokenHash: string): Promise<Invitation | null> {
    return await this.invitationRepository.findByTokenHash(tokenHash);
  }

  async findExpiredInvitations(): Promise<Invitation[]> {
    return await this.invitationRepository.findExpiredInvitations();
  }

  async findByBusiness(businessId: string): Promise<Invitation[]> {
    return await this.invitationRepository.findByBusiness(businessId);
  }

  async findByBusinessAndStatus(
    businessId: string,
    status: string,
  ): Promise<Invitation[]> {
    return await this.invitationRepository.findByBusinessAndStatus(
      businessId,
      status,
    );
  }

  async createInvitation(
    email: string,
    businessId: string,
    inviterUserId: string,
    inviterName: string,
    options: {
      role?: string;
      message?: string;
      roleTemplateId?: string;
      isOwner?: boolean;
      managerId?: string;
      departmentId?: string;
      projectAccess?: Array<{ projectId: string; accessTypes: string[] }>;
      expiryHours?: number;
    },
  ): Promise<Invitation> {
    const existingInvitation = await this.findPendingByEmail(email, businessId);
    if (existingInvitation) {
      throw new Error('There is already a pending invitation for this email');
    }

    const { token, tokenHash } = this.invitationRepository.generateToken();
    const expiryHours = options.expiryHours || 72; // Default 72 hours

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);

    const invitationData: Partial<Invitation> = {
      email,
      businessId,
      status: 'pending',
      role: options.role || 'member',
      inviter: {
        userId: inviterUserId,
        name: inviterName,
        message: options.message,
      },
      assignment: {
        roleTemplateId: options.roleTemplateId,
        isOwner: options.isOwner || false,
        managerId: options.managerId,
        departmentId: options.departmentId,
        projectAccess: options.projectAccess,
      },
      security: {
        token,
        tokenHash,
        expiresAt,
      },
      reminders: [],
    };

    return await this.create(invitationData);
  }

  async acceptInvitation(token: string): Promise<Invitation | null> {
    const invitation = await this.findByToken(token);

    if (!invitation) {
      throw new Error('Invalid invitation token');
    }

    if (invitation.status !== 'pending') {
      throw new Error(`Invitation is ${invitation.status}`);
    }

    if (invitation.security.expiresAt < new Date()) {
      await this.invitationRepository.markAsExpired(invitation.id!.toString());
      throw new Error('Invitation has expired');
    }

    return await this.invitationRepository.markAsAccepted(
      invitation.id!.toString(),
    );
  }

  async revokeInvitation(invitationId: string): Promise<Invitation | null> {
    return await this.updateById(invitationId, {
      status: 'revoked',
    });
  }

  async autoExpireInvitations(): Promise<number> {
    const expiredInvitations = await this.findExpiredInvitations();

    let expiredCount = 0;
    for (const invitation of expiredInvitations) {
      await this.invitationRepository.markAsExpired(invitation.id!.toString());
      expiredCount++;
    }

    return expiredCount;
  }
}

export const invitationService = new InvitationService(invitationRepository);
