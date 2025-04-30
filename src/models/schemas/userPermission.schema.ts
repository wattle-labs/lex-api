import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { MongooseModel } from '../interfaces/document.interface';
import { UserPermission } from '../interfaces/userPermission';

export const userPermissionSchema = new Schema<MongooseModel<UserPermission>>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    resource: {
      type: String,
      required: true,
      trim: true,
    },
    subResource: {
      type: String,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    implications: {
      type: [String],
      default: [],
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

userPermissionSchema.virtual('id').get(function () {
  return this._id.toString();
});

userPermissionSchema.plugin(mongooseLeanVirtuals);

userPermissionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

userPermissionSchema.index(
  { resource: 1, subResource: 1, action: 1 },
  { unique: true },
);
userPermissionSchema.index({ category: 1 });

userPermissionSchema.pre('validate', function (next) {
  try {
    const parts = this.name.split(':');

    if (parts.length < 2 || parts.length > 4) {
      return next(
        new Error('Permission name must have 2-4 parts separated by colons'),
      );
    }

    if (parts[0] !== this.resource) {
      return next(
        new Error('Permission name resource part must match resource field'),
      );
    }

    if (parts.length >= 3 && !this.subResource) {
      this.subResource = parts[1];
    }

    if (parts.length === 2 && this.action !== parts[1]) {
      this.action = parts[1];
    } else if (parts.length >= 3 && this.action !== parts[parts.length - 1]) {
      this.action = parts[parts.length - 1];
    }

    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)));
  }
});
