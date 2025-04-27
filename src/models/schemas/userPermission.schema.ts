import { Schema } from 'mongoose';

import { MongooseModel } from '../interfaces/document.interface';
import { UserPermission } from '../interfaces/userPermission';

export const userPermissionSchema = new Schema<MongooseModel<UserPermission>>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
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

userPermissionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for faster lookups
userPermissionSchema.index({ businessId: 1, name: 1 });
userPermissionSchema.index(
  { businessId: 1, resource: 1, subResource: 1, action: 1 },
  { unique: true },
);
userPermissionSchema.index({ category: 1 });

// Validate that the permission name is properly formatted
userPermissionSchema.pre('validate', function (next) {
  try {
    const parts = this.name.split(':');

    // Basic validation of name format
    if (parts.length < 2 || parts.length > 4) {
      return next(
        new Error('Permission name must have 2-4 parts separated by colons'),
      );
    }

    // Validate that the resource matches the first part of the name
    if (parts[0] !== this.resource) {
      return next(
        new Error('Permission name resource part must match resource field'),
      );
    }

    // Auto-populate subResource if not set
    if (parts.length >= 3 && !this.subResource) {
      this.subResource = parts[1];
    }

    // Auto-populate action if needed
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
