import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { MongooseModel } from '../interfaces/document.interface';
import { Project } from '../interfaces/project';

export const projectSchema = new Schema<MongooseModel<Project>>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'on_hold'],
      default: 'active',
    },
    metadata: {
      region: String,
      department: String,
      priority: {
        type: Number,
        min: 1,
        max: 5,
        default: 3,
      },
      tags: [String],
    },
    ownership: {
      primaryOwnerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      secondaryOwnerIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    dates: {
      created: {
        type: Date,
        default: Date.now,
      },
      updated: Date,
      dueDate: Date,
      closedDate: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

projectSchema.index({ businessId: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'ownership.primaryOwnerId': 1 });
projectSchema.index({ 'metadata.region': 1 });
projectSchema.index({ 'metadata.department': 1 });
projectSchema.index({ 'dates.dueDate': 1 });

projectSchema.virtual('id').get(function () {
  return this._id.toString();
});

projectSchema.plugin(mongooseLeanVirtuals);

projectSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  this.dates.updated = new Date();
  next();
});
