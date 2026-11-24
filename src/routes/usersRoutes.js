import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getUsers,
  getCurrentUser,
  updateCurrentUser,
  getUserById,
} from '../controllers/userController.js';

import { authenticate } from '../middleware/authenticate.js';
import { checkRole } from '../middleware/checkRole.js';
import { validateUserUpdate } from '../middleware/validateUserUpdate.js';

import {
  paginationSchema,
  userIdSchema,
} from '../validations/usersValidation.js';

const router = Router();

// Отримання всіх шукачів роботи (тільки employer)
router.get(
  '/users',
  authenticate,
  checkRole('employer'),
  celebrate(paginationSchema),
  getUsers,
);

// Отримання поточного користувача
router.get(
  '/users/me',
  authenticate,
  getCurrentUser,
);

// Оновлення власного профілю
router.patch(
  '/users/me',
  authenticate,
  validateUserUpdate,
  updateCurrentUser,
);

// Отримання шукача роботи за ID (тільки employer)
router.get(
  '/users/:id',
  authenticate,
  checkRole('employer'),
  celebrate(userIdSchema),
  getUserById,
);

export default router;