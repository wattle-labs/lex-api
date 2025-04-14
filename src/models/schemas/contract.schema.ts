import { Schema } from 'mongoose';

import { Contract } from '../interfaces/contract';
import { MongooseModel } from '../interfaces/document.interface';

export const contractSchema = new Schema<MongooseModel<Contract>>(
  {
    url: { type: String, required: true },
    gsBucketName: { type: String },
    fileName: { type: String, required: true },
    contractTypeId: { type: Schema.Types.ObjectId, ref: 'ContractType' },
    summary: { type: String },
    terms: { type: [Schema.Types.Mixed] },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

contractSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
