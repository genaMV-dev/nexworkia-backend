
import { Job } from '../models/job.js'
import createHttpError from 'http-errors'

const parsePositiveInteger = (value, defaultValue) => {
  const parsedValue = Number(value)

  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
    return defaultValue
  }

  return parsedValue
}

// GET /jobs
export const getAllJobs = async (req, res) => {
  const page = parsePositiveInteger(req.query.page, 1)
  const perPage = Math.min(
    parsePositiveInteger(req.query.perPage, 10),
    100,
  )

  const skip = (page - 1) * perPage

  const currentUserId = req.user?._id

  const filter = currentUserId
    ? { employerId: { $ne: currentUserId } }
    : {}

  const [totalJobs, jobs] = await Promise.all([
    Job.countDocuments(filter),
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage),
  ])

  const totalPages = Math.ceil(totalJobs / perPage)

  res.status(200).json({
    page,
    perPage,
    totalJobs,
    totalPages,
    jobs,
  })
}

// GET /jobs/my
export const getMyJobs = async (req, res) => {
  const page = parsePositiveInteger(req.query.page, 1)
  const perPage = Math.min(
    parsePositiveInteger(req.query.perPage, 10),
    100,
  )

  const skip = (page - 1) * perPage
  const filter = { employerId: req.user._id }

  const [totalJobs, jobs] = await Promise.all([
    Job.countDocuments(filter),
    Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage),
  ])

  const totalPages = Math.ceil(totalJobs / perPage)

  res.status(200).json({
    page,
    perPage,
    totalJobs,
    totalPages,
    jobs,
  })
}

// GET /jobs/:jobId
export const getJobById = async (req, res) => {
  const { jobId } = req.params

  const job = await Job.findById(jobId)

  if (!job) {
    throw createHttpError(404, 'Job not found')
  }

  res.status(200).json(job)
}

// POST /jobs
export const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    employerId: req.user._id,
  })

  res.status(201).json(job)
}

// PATCH /jobs/:jobId
export const updateJob = async (req, res) => {
  const { jobId } = req.params

  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: jobId,
      employerId: req.user._id,
    },
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!updatedJob) {
    throw createHttpError(404, 'Job not found')
  }

  res.status(200).json(updatedJob)
}

// DELETE /jobs/:jobId
export const deleteJobById = async (req, res) => {
  const { jobId } = req.params

  const deletedJob = await Job.findOneAndDelete({
    _id: jobId,
    employerId: req.user._id,
  })

  if (!deletedJob) {
    throw createHttpError(404, 'Job not found')
  }

  res.status(200).json({
    message: 'Job deleted successfully',
  })
}
