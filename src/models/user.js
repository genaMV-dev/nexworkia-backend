import { model, Schema } from 'mongoose';
import { Industry, Role, WorkFormat } from '../constants/userConstants.js';

const userSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    skills: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    experience: { type: Number, default: 0 },
    education: { type: String, default: '' },
    resume: { type: String, default: null },
    location: { type: String, default: '' },
    expectedSalary: { type: Number, default: 0 },
    position: { type: String, default: '' },
    workFormat: { type: WorkFormat, default: 'on-site' },
    role: { type: Role, default: 'employee' },
    industry: { type: Industry, default: 'it' },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
