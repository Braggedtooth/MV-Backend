/* const { StatusCodes } = require('http-status-codes')
const isAdmin = async (res, req, next) => {
  if (res.user.role === 'ADMIN') {
    console.log('user is admin')
    next()
  } else {
    return next('You do not have the permmision to do that')
  }
}
module.exports = isAdmin */
