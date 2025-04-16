import { Schema } from 'mongoose';

import { AuthProvider } from '../interfaces/authProvider';
import { MongooseModel } from '../interfaces/document.interface';

export const authProviderSchema = new Schema<MongooseModel<AuthProvider>>(
  {
    provider: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadataMap: {
      userId: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      roles: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

authProviderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

authProviderSchema.index({ provider: 1 }, { unique: true });
