
import { Router } from 'express'
import { celebrate } from 'celebrate'

import {
  getUsers,
  getCurrentUser,
  updateCurrentUser,
  getUserById,
} from '../controllers/userController.js'

import { authenticate } from '../middleware/authenticate.js'
import { checkRole } from '../middleware/checkRole.js'

import {
  paginationSchema,
  updateUserSchema,
  userIdSchema,
} from '../validations/usersValidation.js'

const router = Router()

// Отримання всіх кандидатів (тільки employer)
router.get(
  '/users',
  authenticate,
  checkRole('employer'),
  celebrate(paginationSchema),
  getUsers,
)

// Отримання поточного користувача
router.get(
  '/users/me',
  authenticate,
  getCurrentUser,
)

// Оновлення власного профілю
router.patch(
  '/users/me',
  authenticate,
  celebrate(updateUserSchema),
  updateCurrentUser,
)

// Отримання користувача за ID
router.get(
  '/users/:id',
  celebrate(userIdSchema),
  getUserById,
)

export default router
