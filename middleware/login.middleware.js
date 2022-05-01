const { comparePasswords } = require('../utils/password')
const { StatusCodes } = require('http-status-codes')
const db = require('../db')
exports.login = () => {
  return async (req, res, next) => {
    try {
      const { email, password } = req.body
      const user = await db.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          password: true,
          email: true,
          role: true,
          status: true,
        },
      });
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: "user not found",
        });
      }
      const correctPassword = await comparePasswords(password, user.password);
      if (correctPassword) {
        return next();
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Incorrect password",
        });
      }
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
          error: 'user with that email and password combination does not exists',
          error
        
      })
    }
  }
}
