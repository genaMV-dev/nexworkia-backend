import { Joi, Segments } from 'celebrate';
import { Role } from '../constants/userConstants.js';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    firstname: Joi.string().trim().min(2).max(32).required(),
    lastname: Joi.string().trim().min(2).max(32).required(),
    email: Joi.string().trim().lowercase().email().max(64).required(),
    password: Joi.string().min(8).max(64).required(),
    role: Joi.string().valid(...Role),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().trim().lowercase().email().max(64).required(),
    password: Joi.string().min(8).max(64).required(),
  }),
};
