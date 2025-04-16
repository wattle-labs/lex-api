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
userPermissionSchema.index({ businessId: 1, name: 1 }, { unique: true });
userPermissionSchema.index({ resource: 1, action: 1 });
userPermissionSchema.index({ category: 1 });
