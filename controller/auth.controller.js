const { StatusCodes } = require('http-status-codes')
const db = require('../db')
const generateToken = require('../utils/generateToken')
/* const permissions = require('../utils/permissions') */

exports.signin = async (req, res) => {
  /** generate a signed json web token and return it in the response */
  const user = await db.user.findUnique({
    where: {
      email: req.body.email
    },
    select: {
      role: true,
      email: true,
      firstname: true,
      lastname: true,
      id: true,
      status: true
    }
  })
  const token = generateToken(user)
  if (!user) {
    return res.json({
      error: 'User with that email and password combination was not found'
    })
  }
  if (user.status === 'BANNED') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: 'You account has been banned'
    })
  }
  if (user.status === 'DELETED') {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: 'You account has been deleted'
    })
  }
  if (user.status === 'PENDING') {
    return res.status(StatusCodes.OK).json({
      data: {
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname,
        role: user.role
      },
      message: 'Your account has been registered for removal',
      token
    })
  }

  if (user.status === 'ACTIVE') {
    res.status(StatusCodes.OK).json({
      data: {
        email: user.email,
        lastname: user.lastname,
        firstname: user.firstname,
        role: user.role
      },
      message: 'Succesfully logged in',
      token
    })
  }
}

exports.signup = async (req, res) => {
  const { email, password, firstname, lastname } = req.body

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Email and password must be provided' })
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: email
    }
  })

  if (existingUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Email is aleready in use...' })
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
