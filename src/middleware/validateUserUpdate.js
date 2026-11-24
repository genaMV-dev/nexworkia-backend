import { celebrate } from 'celebrate';
import createHttpError from 'http-errors';

import {
  updateEmployeeSchema,
  updateEmployerSchema,
} from '../validations/usersValidation.js';

const validateEmployee = celebrate(updateEmployeeSchema);
const validateEmployer = celebrate(updateEmployerSchema);

export const validateUserUpdate = (req, res, next) => {
  switch (req.user?.role) {
    case 'employee':
      return validateEmployee(req, res, next);

    case 'employer':
      return validateEmployer(req, res, next);

    default:
      return next(createHttpError(403, 'Invalid user role'));
  }
};