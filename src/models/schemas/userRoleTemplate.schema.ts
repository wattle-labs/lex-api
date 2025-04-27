import { Schema } from 'mongoose';

import { MongooseModel } from '../interfaces/document.interface';
import { UserRoleTemplate } from '../interfaces/userRoleTemplate';

export const userRoleTemplateSchema = new Schema<
  MongooseModel<UserRoleTemplate>
>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    parentRoleId: {
      type: Schema.Types.ObjectId,
      ref: 'UserRoleTemplate',
    },
    hierarchy: {
      level: {
        type: Number,
        required: true,
        min: 0,
      },
      domain: String,
      canManageRoles: [
        {
          type: Schema.Types.Mixed,
        },
      ],
    },
    basePermissions: {
      type: [Schema.Types.ObjectId],
      ref: 'UserPermission',
      default: [],
    },
    metaPermissions: {
      canInviteUsers: {
        type: Boolean,
        default: false,
      },
      canCreateProjects: {
        type: Boolean,
        default: false,
      },
      canAssignRoles: {
        type: Boolean,
        default: false,
      },
      canManageTeams: {
        type: Boolean,
        default: false,
      },
      canApproveContracts: {
        type: Boolean,
        default: false,
      },
      canExportData: {
        type: Boolean,
        default: false,
      },
      canAccessReports: {
        type: Boolean,
        default: false,
      },
      canManageSettings: {
        type: Boolean,
        default: false,
      },
    },
    constraints: {
      maxProjects: Number,
      regionRestriction: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

userRoleTemplateSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for faster lookups
userRoleTemplateSchema.index({ 'hierarchy.level': 1 });
userRoleTemplateSchema.index({ businessId: 1, name: 1 }, { unique: true });
