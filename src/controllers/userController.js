
import createHttpError from 'http-errors'
import { User } from '../models/user.js'

const parsePositiveInteger = (value, defaultValue) => {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return defaultValue
  }

  return parsedValue
}

const publicUserFields = '-password -email -__v'

// GET /users
export const getUsers = async (req, res) => {
  const page = parsePositiveInteger(req.query.page, 1)
  const perPage = Math.min(
    parsePositiveInteger(req.query.perPage, 20),
    100,
  )

  const skip = (page - 1) * perPage

  const userQuery = User.find()
    .select(publicUserFields)
    .sort({ createdAt: -1 })

  const [totalUsers, users] = await Promise.all([
    userQuery.clone().countDocuments(),
    userQuery.skip(skip).limit(perPage),
  ])

  const totalPages = Math.ceil(totalUsers / perPage)

  res.status(200).json({
    page,
    perPage,
    totalUsers,
    totalPages,
    users,
  })
}

// GET /users/me
export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -__v')

  if (!user) {
    throw createHttpError(404, 'User not found')
  }

  res.status(200).json({ user })
}

// PATCH /users/me
export const updateCurrentUser = async (req, res) => {
  const allowedFields = [
    'firstname',
    'lastname',
    'skills',
    'languages',
    'experience',
    'education',
    'resume',
    'location',
    'expectedSalary',
    'position',
    'workFormat',
    'industry',
  ]

  const update = {}

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      update[field] = req.body[field]
    }
  }

  if (Object.keys(update).length === 0) {
    throw createHttpError(400, 'No fields provided for update')
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: update },
    {
      new: true,
      runValidators: true,
    },
  ).select('-password -__v')

  if (!updatedUser) {
    throw createHttpError(404, 'User not found')
  }

  res.status(200).json({ user: updatedUser })
}

// GET /users/:id
export const getUserById = async (req, res) => {
  const { id } = req.params

  const user = await User.findById(id)
    .select(publicUserFields)

  if (!user) {
    throw createHttpError(404, 'User not found')
  }

  res.status(200).json({ user })
}
