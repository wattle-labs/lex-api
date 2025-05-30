import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { ClauseDefinition } from '../interfaces/clauseDefinition';
import { MongooseModel } from '../interfaces/document.interface';

export const clauseDefinitionSchema = new Schema<
  MongooseModel<ClauseDefinition>
>(
  {
    name: { type: String, required: true },
    description: { type: String },
    outputFormat: { type: String, required: true },
    sampleOutput: { type: [String] },
    isCustom: { type: Boolean },
    isObligation: { type: Boolean, default: false },
    obligationType: { type: String },
    contractTypes: { type: [Schema.Types.ObjectId] },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

clauseDefinitionSchema.virtual('id').get(function () {
  return this._id.toString();
});

clauseDefinitionSchema.plugin(mongooseLeanVirtuals);

clauseDefinitionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
