import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { Business } from '../interfaces/business';
import { MongooseModel } from '../interfaces/document.interface';

export const businessSchema = new Schema<MongooseModel<Business>>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Slug can only contain alphanumeric characters and underscores',
      ],
      trim: true,
    },
    domains: {
      type: [String],
      default: [],
    },
    settings: {
      defaultRoleId: {
        type: Schema.Types.ObjectId,
        ref: 'RoleTemplate',
      },
      invitationExpiry: {
        type: Number,
        default: 72, // 72 hours (3 days) by default
      },
      enforceHierarchy: {
        type: Boolean,
        default: true,
      },
      permissionPolicy: {
        type: String,
        enum: ['restrictive', 'permissive'],
        default: 'restrictive',
      },
    },
    setup: {
      status: {
        type: String,
        enum: ['pending', 'owner_invited', 'active', 'suspended'],
        default: 'pending',
      },
      completedSteps: {
        type: [String],
        default: [],
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      ownerInvitationId: {
        type: Schema.Types.ObjectId,
        ref: 'Invitation',
      },
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

businessSchema.virtual('id').get(function () {
  return this._id.toString();
});

businessSchema.plugin(mongooseLeanVirtuals);

businessSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

businessSchema.index({ slug: 1 }, { unique: true });
