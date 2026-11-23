import createHttpError from 'http-errors'

export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createHttpError(401, 'Unauthorized'))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createHttpError(403, 'Access denied'))
    }

    next()
  }
}