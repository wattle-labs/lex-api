import { Schema } from 'mongoose';

import { MongooseModel } from '../interfaces/document';
import { View, ViewCriteria } from '../interfaces/view';

export const viewCriteriaSchema = new Schema<MongooseModel<ViewCriteria>>({
  filter: { type: Object },
  sort: { type: Object },
});

export const viewSchema = new Schema<MongooseModel<View>>(
  {
    name: { type: String, required: true },
    userIds: { type: [Schema.Types.ObjectId], ref: 'User' },
    criteria: { type: viewCriteriaSchema },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

viewSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

viewSchema.index({ name: 'text' });
