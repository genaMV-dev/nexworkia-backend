import { Schema, model } from 'mongoose';
import { Industry, WorkFormat } from '../constants/userConstants.js';


const jobSchema = new Schema(
  {
    position: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    industry: {
      type: String,
      enum: Industry,
      required: true,
    },
    workFormat: {
      type: String,
      enum: WorkFormat,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
    },
    specializedEducation: {
      type: Boolean,
      required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    company: {
        type: String,
        trim: true,
        required: true,
    },
    companyDescription: {
        type: String,
        trim: true,
        required: true,
    },
    author: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Job = model('Job', jobSchema);