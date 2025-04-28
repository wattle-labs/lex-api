import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { AdminPermission } from '../interfaces/adminPermission';
import { MongooseModel } from '../interfaces/document.interface';

export const adminPermissionSchema = new Schema<MongooseModel<AdminPermission>>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    resource: { type: String, required: true },
    action: { type: String, required: true },
    category: { type: String, required: true },
    implications: [{ type: String }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

adminPermissionSchema.virtual('id').get(function () {
  return this._id.toString();
});

adminPermissionSchema.plugin(mongooseLeanVirtuals);

adminPermissionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

adminPermissionSchema.index({ name: 1 }, { unique: true });
