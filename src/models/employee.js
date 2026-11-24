import { Schema } from 'mongoose';
import { User } from './user.js';
import { WorkFormat } from '../constants/userConstants.js';

const employeeSchema = new Schema({
  skills: { type: [String], default: [] },
  languages: { type: [String], default: [] },
  experience: { type: Number, default: 0, min: 0 },
  education: { type: String, default: '' },
  resume: { type: String, default: null },
  expectedSalary: { type: Number, default: 0, min: 0 },
  position: { type: String, default: '' },
  workFormat: {
    type: String,
    enum: WorkFormat,
    default: 'on-site',
  },
});

export const Employee = User.discriminator(
  'Employee',
  employeeSchema,
  'employee'
);