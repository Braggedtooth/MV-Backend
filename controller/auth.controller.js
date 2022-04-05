const { StatusCodes } = require('http-status-codes')
const db = require('../db')
const generateToken = require('../utils/generateToken')
/* const permissions = require('../utils/permissions') */

exports.signin = async (req, res) => {
  const expires = parseInt(process.env.JWT_EXPIRATION_MS)
  /** generate a signed json web token and return it in the response */
  const user = await db.user.findUnique({
    where: {
      email: req.body.email
    },
    select: { role: true, email: true, firstname: true, lastname: true, id: true }
  })
  if (!user) {
    return res.json({
      error: {
        message: 'User with that email and password combination was not found'
      }
    })
  }
  const token = generateToken(user)
  /** assign  jwt to the cookie */
  res.cookie('jwt', token, {
    signed: true,
    httpOnly: true,
    secure: false,
    maxAge: expires
  }).status(StatusCodes.OK).json({ data: { email: user.email, lastname: user.lastname, firstname: user.firstname, role: user.role }, message: 'Succesfully logged in', token })
}

exports.signup = async (req, res, next) => {
  const { email, password, firstname, lastname } = req.body

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { message: 'Email and password must be provided' } })
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: email
    }
  })

  if (existingUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'Email is aleready in use...' } })
  }

  await db.user.create({
    data: {
      email,
      password,
      firstname,
      lastname
    }
  })

  return res.json({ message: 'Account Succesfully Created' })
}
