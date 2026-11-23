import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { Industry, WorkFormat } from '../constants/userConstants';

const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid ID format');
  }
  return value;
};

export const paginationSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(12),
  }),
};

export const updateUserSchema = {
  [Segments.BODY]: Joi.object({
    firstname: Joi.string().trim().min(2).max(32),
    lastname: Joi.string().trim().min(2).max(32),
    skills: Joi.array().items(Joi.string().trim().min(1)).unique(),
    languages: Joi.array().items(Joi.string().trim().min(1)).unique(),
    experience: Joi.number().integer().min(0).max(60),
    education: Joi.string().trim().max(200),
    resume: Joi.string().trim().uri(),
    location: Joi.string().trim().max(100),
    expectedSalary: Joi.number().integer().min(0),
    position: Joi.string().trim().max(100),
    workFormat: Joi.string().valid(...WorkFormat),
    industry: Joi.string().valid(...Industry),
  })
    .min(1)
    .unknown(false),
};

export const userIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
};
