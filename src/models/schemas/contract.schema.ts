import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { Contract, ContractStatus } from '../interfaces/contract';
import { MongooseModel } from '../interfaces/document.interface';
import { Party } from '../interfaces/party';

export const partySchema = new Schema<MongooseModel<Party>>({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
});

export const contractSchema = new Schema<MongooseModel<Contract>>(
  {
    url: { type: String, required: true },
    gsBucketName: { type: String },
    fileName: { type: String, required: true },
    contractTypeId: { type: Schema.Types.ObjectId, ref: 'ContractType' },
    summary: { type: String },
    terms: { type: Schema.Types.Mixed },
    parties: { type: [partySchema] },
    label: { type: String, required: true },
    text: { type: String },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    status: {
      type: String,
      enum: ContractStatus,
      default: ContractStatus.PENDING,
    },
    tags: { type: [String] },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

contractSchema.virtual('id').get(function () {
  return this._id.toString();
});

contractSchema.plugin(mongooseLeanVirtuals);

contractSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
