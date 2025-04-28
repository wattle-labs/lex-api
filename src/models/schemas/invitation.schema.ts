import crypto from 'crypto';
import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { MongooseModel } from '../interfaces/document.interface';
import { Invitation } from '../interfaces/invitation';

const projectAccessSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    accessTypes: {
      type: [String],
      enum: ['view', 'edit', 'admin'],
      default: ['view'],
    },
  },
  { _id: false },
);

const reminderSchema = new Schema(
  {
    sentAt: {
      type: Date,
      required: true,
    },
    method: {
      type: String,
      enum: ['email', 'sms', 'notification'],
      default: 'email',
    },
  },
  { _id: false },
);

export const invitationSchema = new Schema<MongooseModel<Invitation>>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired', 'revoked'],
      default: 'pending',
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
    inviter: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: String,
      message: String,
    },
    assignment: {
      roleTemplateId: {
        type: Schema.Types.ObjectId,
        ref: 'RoleTemplate',
      },
      isOwner: {
        type: Boolean,
        default: false,
      },
      managerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
      },
      projectAccess: [projectAccessSchema],
    },
    security: {
      token: {
        type: String,
      },
      tokenHash: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: {
        type: Date,
      },
      usedAt: Date,
    },
    reminders: [reminderSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

invitationSchema.index({ email: 1, businessId: 1 });
invitationSchema.index({ status: 1 });

// Helper method to generate token
invitationSchema.statics.generateToken = function (): {
  token: string;
  tokenHash: string;
} {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
};

// Auto-expire invitations
invitationSchema.virtual('isExpired').get(function () {
  if (!this.security) return false;
  return this.status === 'pending' && this.security.expiresAt < new Date();
});

invitationSchema.virtual('id').get(function () {
  return this._id.toString();
});

invitationSchema.plugin(mongooseLeanVirtuals);

// Pre-save hook to update status if expired
invitationSchema.pre('save', function (next) {
  this.updatedAt = new Date();

  next();
});
