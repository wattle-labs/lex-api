import { Schema } from 'mongoose';

import { Business } from '../interfaces/business';
import { MongooseModel } from '../interfaces/document.interface';

export const businessSchema = new Schema<MongooseModel<Business>>(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Slug can only contain alphanumeric characters and underscores',
      ],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

businessSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
