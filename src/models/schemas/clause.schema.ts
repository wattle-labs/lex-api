import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { Clause } from '../interfaces/clause';
import { MongooseModel } from '../interfaces/document.interface';

export const clauseSchema = new Schema<MongooseModel<Clause>>(
  {
    clauseDefinitionId: {
      type: Schema.Types.ObjectId,
      ref: 'ClauseDefinition',
      required: true,
    },
    dueDate: { type: Date },
    responsibleParty: { type: Schema.Types.ObjectId, ref: 'Party' },
    value: { type: String },
    snippet: { type: String },
    isStandardForm: { type: Boolean },
    standardFormOptionType: { type: String },
    isExample: { type: Boolean },
    usageCriteria: { type: String },
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

clauseSchema.virtual('id').get(function () {
  return this._id.toString();
});

clauseSchema.plugin(mongooseLeanVirtuals);

clauseSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});
