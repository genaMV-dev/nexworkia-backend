
import { Joi, Segments } from 'celebrate';
import { isObjectIdOrHexString } from 'mongoose';
import { Industry, WorkFormat } from '../constants/userConstants.js';

const objectIdValidator = (value, helpers) => {
  if (!isObjectIdOrHexString(value)) {
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

// Спільні властивості Employee та Employer
const commonUserFields = {
  firstname: Joi.string().trim().min(2).max(32),
  lastname: Joi.string().trim().min(2).max(32),
  location: Joi.string().trim().max(100).allow(''),
  industry: Joi.string().valid(...Industry),
};

// Оновлення профілю шукача роботи
export const updateEmployeeSchema = {
  [Segments.BODY]: Joi.object({
    ...commonUserFields,

    skills: Joi.array()
      .items(Joi.string().trim().min(1))
      .unique(),

    languages: Joi.array()
      .items(Joi.string().trim().min(1))
      .unique(),

    experience: Joi.number().integer().min(0).max(60),

    education: Joi.string().trim().max(200).allow(''),

    resume: Joi.string().trim().uri({
      scheme: ['http', 'https'],
    }).allow(null),

    expectedSalary: Joi.number().integer().min(0),

    position: Joi.string().trim().max(100).allow(''),

    workFormat: Joi.string().valid(...WorkFormat),
  })
    .min(1)
    .unknown(false),
};

// Оновлення профілю роботодавця
export const updateEmployerSchema = {
  [Segments.BODY]: Joi.object({
    ...commonUserFields,

    companyName: Joi.string().trim().max(100).allow(''),

    companyDescription: Joi.string().trim().max(2000).allow(''),

    companyWebsite: Joi.string().trim().uri({
      scheme: ['http', 'https'],
    }).allow(''),

    companySize: Joi.number().integer().min(0),
  })
    .min(1)
    .unknown(false),
};

// Валідація ID користувача
export const userIdSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
  }),
};
