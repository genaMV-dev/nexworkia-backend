import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { Industry, WorkFormat } from '../constants/userConstants.js';

const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid ID format');
  }

  return value;
};

export const jobIdSchema = {
  [Segments.PARAMS]: Joi.object({
    jobId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const getAllJobsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(10),
  }),
};

export const createJobSchema = {
  [Segments.BODY]: Joi.object({
    position: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    experience: Joi.number().integer().min(0).required(),
    industry: Joi.string().valid(...Industry).required(),
    workFormat: Joi.string().valid(...WorkFormat).required(),
    skills: Joi.array().items(Joi.string().trim().min(1)).unique().required(),
    requirements: Joi.array().items(Joi.string().trim().min(1)).unique().required(),
    specializedEducation: Joi.boolean().required(),
    salary: Joi.number().min(0).required(),
    company: Joi.string().trim().required(),
    companyDescription: Joi.string().trim().required(),
    author: Joi.string().trim().required(),
  }).unknown(false),
};

export const updateJobSchema = {
  [Segments.BODY]: Joi.object({
    position: Joi.string().trim(),
    description: Joi.string().trim(),
    experience: Joi.number().integer().min(0),
    industry: Joi.string().valid(...Industry),
    workFormat: Joi.string().valid(...WorkFormat),
    skills: Joi.array().items(Joi.string().trim().min(1)).unique(),
    requirements: Joi.array().items(Joi.string().trim().min(1)).unique(),
    specializedEducation: Joi.boolean(),
    salary: Joi.number().min(0),
    company: Joi.string().trim(),
    companyDescription: Joi.string().trim(),
    author: Joi.string().trim(),
  }).min(1).unknown(false),
};
