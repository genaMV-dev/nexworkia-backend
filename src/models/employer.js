import { Schema } from 'mongoose';
import { User } from './user.js';

const employerSchema = new Schema({
  companyName: { type: String, default: '', trim: true },
  companyDescription: { type: String, default: '', trim: true },
});

export const Employer = User.discriminator(
  'Employer',
  employerSchema,
  'employer'
);