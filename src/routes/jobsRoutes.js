
import { Router } from 'express'
import { celebrate } from 'celebrate'

import {
  authenticate,
  optionalAuthenticate,
} from '../middleware/authenticate.js'

import { checkRole } from '../middleware/checkRole.js'

import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  deleteJobById,
  updateJob,
} from '../controllers/jobController.js'

import {
  jobIdSchema,
  createJobSchema,
  getAllJobsSchema,
  updateJobSchema,
} from '../validations/jobsValidation.js'

const router = Router()

// Отримання власних вакансій (тільки employer)
router.get(
  '/jobs/my',
  authenticate,
  checkRole('employer'),
  celebrate(getAllJobsSchema),
  getMyJobs,
)

// Отримання всіх вакансій, крім власних
router.get(
  '/jobs',
  optionalAuthenticate,
  celebrate(getAllJobsSchema),
  getAllJobs,
)

// Створення вакансії (тільки employer)
router.post(
  '/jobs',
  authenticate,
  checkRole('employer'),
  celebrate(createJobSchema),
  createJob,
)

// Отримання вакансії за ID
router.get(
  '/jobs/:jobId',
  celebrate(jobIdSchema),
  getJobById,
)

// Оновлення власної вакансії (тільки employer)
router.patch(
  '/jobs/:jobId',
  authenticate,
  checkRole('employer'),
  celebrate(jobIdSchema),
  celebrate(updateJobSchema),
  updateJob,
)

// Видалення власної вакансії (тільки employer)
router.delete(
  '/jobs/:jobId',
  authenticate,
  checkRole('employer'),
  celebrate(jobIdSchema),
  deleteJobById,
)

export default router
