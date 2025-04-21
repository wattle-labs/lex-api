import { ObjectId } from 'mongoose';

export interface Invitation {
  id?: string | ObjectId;
  /**
   * Invitee email address
   * @format email
   */
  email: string;
  businessId: string | ObjectId;
  /**
   * Status: "pending", "accepted", "expired", "revoked"
   */
  status: string;
  /**
   * "owner", "admin", "member" - explicit invitation role
   */
  role: string;
  /**
   * Inviter information
   */
  inviter: {
    userId?: string | ObjectId;
    name?: string;
    /**
     * Optional message
     */
    message?: string;
  };
  assignment: {
    /**
     * Role to assign upon acceptance
     */
    roleTemplateId?: string | ObjectId;
    /**
     * Flag for business ownership
     */
    isOwner: boolean;
    /**
     * Reporting manager
     */
    managerId?: string | ObjectId;
    /**
     * Assigned department
     */
    departmentId?: string | ObjectId;
    /**
     * Initial project access grants
     */
    projectAccess?: {
      /**
       * Project to grant access to
       */
      projectId: string | ObjectId;
      /**
       * Access types for this project
       */
      accessTypes: string[];
    }[];
  };
  /**
   * Security details
   */
  security?: {
    /**
     * Secure invitation token
     */
    token: string;
    /**
     * Hash for verification
     */
    tokenHash: string;
    /**
     * When invitation was created
     */
    createdAt?: Date;
    /**
     * When invitation expires
     */
    expiresAt: Date;
    /**
     * When invitation was accepted
     */
    usedAt?: Date;
  };
  /**
   * Track reminder attempts
   */
  reminders?: {
    /**
     * When reminder was sent
     */
    sentAt: Date;
    /**
     * How reminder was sent
     */
    method: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
