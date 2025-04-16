import { Schema } from 'mongoose';

import { MongooseModel } from '../interfaces/document.interface';
import { UserRole } from '../interfaces/userRole';

const customPermissionSchema = new Schema(
  {
    permission: {
      type: String,
      required: true,
    },
    granted: {
      type: Boolean,
      required: true,
    },
    resources: [String],
    conditions: Schema.Types.Mixed,
  },
  { _id: false },
);

export const userRoleSchema = new Schema<MongooseModel<UserRole>>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    userRoleTemplateId: {
      type: Schema.Types.ObjectId,
      ref: 'UserRoleTemplate',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    scope: {
      isGlobal: {
        type: Boolean,
        default: true,
      },
      projectIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Project',
        },
      ],
    },
    customPermissions: [customPermissionSchema],
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

userRoleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for faster lookups
userRoleSchema.index({ userId: 1, businessId: 1 });
userRoleSchema.index({ userId: 1, isActive: 1 });
userRoleSchema.index({ businessId: 1, userRoleTemplateId: 1 });
