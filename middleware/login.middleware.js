const { comparePasswords } = require('../utils/password')
const { StatusCodes, getReasonPhrase } = require('http-status-codes')
const db = require('../db')
exports.login = () => {
  return async (req, res, next) => {
    try {
      const { email, password } = req.body
      const User = await db.user.findUnique({
        where: {
          email: email
        },
        select: { id: true, password: true, email: true }
      })
      if (!User) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'user not found',
          error: getReasonPhrase(400)
        })
      }
      const correctPassword = await comparePasswords(password, User.password)
      if (!correctPassword) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          error: getReasonPhrase(401),
          message: 'Incorrect password'
        })
      }
      return next()
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: getReasonPhrase(400),
        error: error
      })
    }
  }
}
