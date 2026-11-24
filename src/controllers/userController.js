
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Employee } from '../models/employee.js';
import { Employer } from '../models/employer.js';

const parsePositiveInteger = (value, defaultValue) => {
  const parsedValue = Number(value);

  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return parsedValue;
};

const publicUserFields = '-password -email -__v';

const commonFields = [
  'firstname',
  'lastname',
  'location',
  'industry',
];

const employeeFields = [
  ...commonFields,
  'skills',
  'languages',
  'experience',
  'education',
  'resume',
  'expectedSalary',
  'position',
  'workFormat',
];

const employerFields = [
  ...commonFields,
  'companyName',
  'companyDescription',
  'companyWebsite',
  'companySize',
];

// GET /users
export const getUsers = async (req, res) => {
  const page = parsePositiveInteger(req.query.page, 1);
  const perPage = Math.min(
    parsePositiveInteger(req.query.perPage, 20),
    100
  );

  const skip = (page - 1) * perPage;

  const [totalUsers, users] = await Promise.all([
    Employee.countDocuments(),
    Employee.find()
      .select(publicUserFields)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalUsers / perPage);

  res.status(200).json({
    page,
    perPage,
    totalUsers,
    totalPages,
    users,
  });
};

// GET /users/me
export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -__v');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({ user });
};

// PATCH /users/me
export const updateCurrentUser = async (req, res) => {
  const { role } = req.user;

  if (!['employee', 'employer'].includes(role)) {
    throw createHttpError(403, 'Invalid user role');
  }

  const UserModel = role === 'employer' ? Employer : Employee;

  const allowedFields =
    role === 'employer' ? employerFields : employeeFields;

  const update = {};

  for (const field of Object.keys(req.body)) {
    if (!allowedFields.includes(field)) {
      throw createHttpError(400, `Field "${field}" is not allowed`);
    }

    if (req.body[field] !== undefined) {
      update[field] = req.body[field];
    }
  }

  if (Object.keys(update).length === 0) {
    throw createHttpError(400, 'No fields provided for update');
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $set: update },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password -__v');

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({ user: updatedUser });
};

// GET /users/:id
export const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await Employee.findById(id)
    .select(publicUserFields);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({ user });
};
