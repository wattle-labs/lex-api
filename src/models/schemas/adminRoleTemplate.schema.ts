import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { AdminRoleTemplate } from '../interfaces/adminRoleTemplate';
import { MongooseModel } from '../interfaces/document.interface';

export const adminRoleTemplateSchema = new Schema<
  MongooseModel<AdminRoleTemplate>
>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    basePermissions: [{ type: Schema.Types.ObjectId, ref: 'AdminPermission' }],
    hierarchy: {
      level: { type: Number, required: true, min: 1 },
      canManageRoles: [{ type: String }],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

adminRoleTemplateSchema.virtual('id').get(function () {
  return this._id.toString();
});

adminRoleTemplateSchema.plugin(mongooseLeanVirtuals);

adminRoleTemplateSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

adminRoleTemplateSchema.index({ name: 1 }, { unique: true });
