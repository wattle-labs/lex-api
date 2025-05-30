import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { Admin } from '../interfaces/admin';
import { MongooseModel } from '../interfaces/document.interface';

export const adminSchema = new Schema<MongooseModel<Admin>>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    adminRoleTemplateId: {
      type: Schema.Types.ObjectId,
      ref: 'AdminRoleTemplate',
      required: true,
    },
    customPermissions: [
      {
        permission: {
          type: Schema.Types.ObjectId,
          ref: 'AdminPermission',
          required: true,
        },
        granted: { type: Boolean, required: true },
        resources: [{ type: String }],
      },
    ],
    scope: {
      businessIds: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
      features: [{ type: String }],
    },
    addedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

adminSchema.virtual('id').get(function () {
  return this._id.toString();
});

adminSchema.plugin(mongooseLeanVirtuals);

adminSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

adminSchema.index({ email: 1 }, { unique: true });
