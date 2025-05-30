import { Schema } from 'mongoose';

import { MongooseModel } from '../interfaces/document';
import { User, UserProfile } from '../interfaces/user';

const userProfileSchema = new Schema<MongooseModel<UserProfile>>({
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String },
  image: { type: String },
});

export const userSchema = new Schema<MongooseModel<User>>(
  {
    email: { type: String, required: true },
    role: { type: String, required: true },
    profile: { type: userProfileSchema, required: true },
    teamIds: { type: [Schema.Types.ObjectId], ref: 'Team' },
    managedTeamIds: { type: [Schema.Types.ObjectId], ref: 'Team' },
    viewIds: { type: [Schema.Types.ObjectId], ref: 'View' },
    externalId: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

userSchema.index({ email: 'text' });
