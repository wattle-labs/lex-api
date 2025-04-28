import { Schema } from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';

import { MongooseModel } from '../interfaces/document.interface';
import { User } from '../interfaces/user';

export const userSchema = new Schema<MongooseModel<User>>(
  {
    externalId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    otherBusinesses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Business',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'invited', 'disabled'],
      default: 'invited',
    },
    onboarding: {
      completedAt: Date,
      invitationId: {
        type: Schema.Types.ObjectId,
        ref: 'Invitation',
      },
      isBusinessOwner: {
        type: Boolean,
        default: false,
      },
    },
    profile: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      jobTitle: String,
      department: String,
      region: String,
      timezone: String,
    },
    hierarchy: {
      managerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      level: Number,
      directReports: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    authProvider: {
      provider: {
        type: String,
        required: true,
      },
      lastLogin: Date,
      metadata: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
  },
);

userSchema.virtual('id').get(function () {
  return this._id.toString();
});

userSchema.virtual('fullName').get(function () {
  return `${this?.profile?.firstName ?? ''} ${this?.profile?.lastName ?? ''}`;
});

userSchema.plugin(mongooseLeanVirtuals);

userSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

userSchema.index({ businessId: 1 });
userSchema.index({ externalId: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
