import { model, Schema } from 'mongoose';
import { Industry } from '../constants/userConstants.js';

const userSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    location: { type: String, default: '' },
    industry: { type: String, enum: Industry, default: 'it' },
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
  }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);