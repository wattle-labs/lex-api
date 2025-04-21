import { Schema } from 'mongoose';

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
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

adminRoleTemplateSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

adminRoleTemplateSchema.index({ name: 1 }, { unique: true });
