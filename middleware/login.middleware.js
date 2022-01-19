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
          error: 'user not found'

        })
      }
      const correctPassword = await comparePasswords(password, User.password)
      if (!correctPassword) {
        res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Incorrect password'

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
