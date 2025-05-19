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
    isStandard: { type: Boolean, required: true, default: false },
    isObligation: { type: Boolean, required: true, default: false },
    dueDate: { type: Date },
    responsibleParty: { type: String },
    type: { type: String },
    value: { type: String },
    snippet: { type: String },
    contractTypes: { type: [Schema.Types.ObjectId] },
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
