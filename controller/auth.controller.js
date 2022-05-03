const { StatusCodes } = require('http-status-codes')
const db = require('../db')
const sendEmail = require('../services/mailer')
const { verifyHtml, resendHtml } = require('../services/templates')
const generateToken = require('../utils/generateToken')

const signin = async (req, res) => {
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
      verified: true,
      status: true,
      OTP: true
    }
  })
  const token = generateToken(user)
  if (!user) {
    return res.json({
      error: 'User with that email and password combination was not found'
    })
  }
  if (user.verified !== true) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'Your account has not yet been verified'
    })
  }
  if (user.status === 'BANNED') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'You account has been banned'
    })
  }
  if (user.status === 'DELETED') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
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
const signup = async (req, res) => {
  const { email, password, firstname, lastname } = req.body

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Email and password must be provided' })
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: email
    },
    select: {
      id: true,
      OTP: true,
      verified: true,
      email: true,
      firstname: true,
      lastname: true
    }
  })

  if (existingUser) {
    if (existingUser.verified === true) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: 'Email is already in use...' })
    }
    if (existingUser.OTP === null) {
      const code = await db.otp.create({
        data: {
          userId: existingUser.id,
          expires: Date.now() + 900000
        }
      })
      sendEmail({
        to: existingUser.email,
        subject: 'Ny verifications länk',
        html: resendHtml(existingUser.firstname, existingUser.lastname, code.id)
      })
      return res
        .status(StatusCodes.OK)
        .json({ message: 'New verification link sent to email' })
    }
  }

  const user = await db.user.create({
    data: {
      email,
      password,
      firstname,
      lastname
    }
  })

  const code = await db.otp.create({
    data: {
      userId: user.id,
      expires: Date.now() + 900000
    }
  })

  sendEmail({
    to: user.email,
    subject: 'Verifiera ditt konto',
    html: verifyHtml(user.firstname, user.lastname, code.id)
  })

  return res.json({ message: 'Verification link sent to email' })
}

const verify = async (req, res) => {
  const { token } = req.query
  if (!token) {
    return res.status(400)
  }
  let ts = Date.now()
  const code = await db.otp.findFirst({
    where: { id: token }
  })
  if (!code) {
    return res.status(400).json({ error: 'Token does not exists' })
  }
  if (code.expires < ts) {
    return res.status(400).json({ error: 'Token has expired' })
  }

  await db.user.update({
    where: {
      id: code.userId
    },
    data: {
      verified: true
    }
  })
  await db.otp.delete({
    where: {
      id: token
    }
  })
  return res.json({ message: 'Account Verified' })
}

module.exports = {
  verify,
  signup,
  signin
}
