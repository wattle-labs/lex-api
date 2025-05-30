import { Schema } from 'mongoose';

import { MongooseModel } from '../interfaces/document.interface';
import { Party } from '../interfaces/party';

export const partySchema = new Schema<MongooseModel<Party>>(
  {
    name: { type: String, required: true },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

partySchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

partySchema.index({ name: 'text' }, { name: 'party-names' });
