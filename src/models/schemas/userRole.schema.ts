import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

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
      type: Schema.Types.Mixed,
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

userRoleSchema.virtual('id').get(function () {
  return this._id.toString();
});

userRoleSchema.plugin(mongooseLeanVirtuals);

userRoleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

userRoleSchema.index({ userId: 1, businessId: 1 });
userRoleSchema.index({ userId: 1, isActive: 1 });
userRoleSchema.index({ businessId: 1, userRoleTemplateId: 1 });
