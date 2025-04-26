import { Schema } from 'mongoose';

import { MongooseModel } from '../interfaces/document';
import { Project } from '../interfaces/project';

export const projectSchema = new Schema<MongooseModel<Project>>(
  {
    name: { type: String, required: true },
    userIds: { type: [Schema.Types.ObjectId], ref: 'User' },
    contractIds: { type: [Schema.Types.ObjectId], ref: 'Contract' },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

projectSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
