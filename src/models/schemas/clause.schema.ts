import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { Clause } from '../interfaces/clause';
import { MongooseModel } from '../interfaces/document.interface';

export const clauseSchema = new Schema<MongooseModel<Clause>>(
  {
    name: { type: String, required: true },
    description: { type: String },
    outputFormat: { type: String, required: true },
    sampleOutput: { type: [String] },
    isCustom: { type: Boolean },
    isObligation: { type: Boolean, default: false },
    dueDate: { type: Date },
    responsibleParty: { type: String },
    type: { type: String },
    value: { type: String },
    snippet: { type: String },
    contractTypes: { type: [Schema.Types.ObjectId] },
    businessId: { type: Schema.Types.ObjectId, ref: 'Business' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

clauseSchema.virtual('id').get(function () {
  return this._id.toString();
});

clauseSchema.plugin(mongooseLeanVirtuals);

clauseSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
