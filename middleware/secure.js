const { isAsync } = require('zod');
const ApiError = require('../errorConstructor')

exports.isAdmin() {
  return async (res, req, next)
  if (req.isAuthenticated()) {
    next(res);
  } else {
    throw new ApiError(401, "Unauthorized")
  }
}
