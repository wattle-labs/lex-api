import { Schema } from 'mongoose';

import { MongooseModel } from '../interfaces/document.interface';
import { ProjectAccess } from '../interfaces/projectAccess';

export const projectAccessSchema = new Schema<MongooseModel<ProjectAccess>>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
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
    accessTypes: {
      type: [String],
      enum: ['view', 'edit', 'admin'],
      default: ['view'],
    },
    inherited: {
      type: Boolean,
      default: false,
    },
    source: {
      grantedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      grantedAt: {
        type: Date,
        default: Date.now,
      },
      reasonCode: String,
      comment: String,
    },
    constraints: {
      expiresAt: Date,
      conditions: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

// Indexes for faster lookups
projectAccessSchema.index({ projectId: 1, userId: 1 }, { unique: true });
projectAccessSchema.index({ userId: 1 });
projectAccessSchema.index({ businessId: 1 });
projectAccessSchema.index({ 'constraints.expiresAt': 1 }, { sparse: true });

projectAccessSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
