
import { User } from '../models/user.js';
import { Employee } from '../models/employee.js';
import { Employer } from '../models/employer.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  if (!['employee', 'employer'].includes(role)) {
    throw createHttpError(400, 'Invalid role');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const UserModel = role === 'employer' ? Employer : Employee;

  const user = await UserModel.create({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteOne({
    userId: user._id,
  });

  const newSession = await createSession(user._id);
  setSessionCookies(res, newSession);

  const userData = user.toJSON();

  res.status(200).json({
    ...userData,
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
    sessionId: newSession._id,
  });
};

export const logoutUser = async (req, res) => {
  if (req.cookies.sessionId) {
    await Session.deleteOne({ _id: req.cookies.sessionId });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing tokens');
  }

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'No session');
  }

  const isRefreshTokenExpired =
    session.refreshTokenValidUntil < new Date();

  if (isRefreshTokenExpired) {
    await session.deleteOne();

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    throw createHttpError(401, 'Session expired');
  }

  await session.deleteOne();

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Refresh success!',
  });
};
