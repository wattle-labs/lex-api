import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { ContractType } from '../interfaces/contractType';
import { MongooseModel } from '../interfaces/document.interface';

export const contractTypeSchema = new Schema<MongooseModel<ContractType>>(
  {
    shortName: { type: String, required: true },
    longName: { type: String, required: true },
    description: { type: String },
    clauses: { type: [Schema.Types.ObjectId], ref: 'Clause' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

contractTypeSchema.virtual('id').get(function () {
  return this._id.toString();
});

contractTypeSchema.plugin(mongooseLeanVirtuals);

contractTypeSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
