const { StatusCodes } = require('http-status-codes')
const { otp } = require('../db')
const db = require('../db')
const sendEmail = require('../services/mailer')
const generateToken = require('../utils/generateToken')
const CLIENTURL = process.env.CLIENT_BASE_URL

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
    }
  })

  if (existingUser) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Email is aleready in use...' })
  }
  const user = await db.user.create({
    data: {
      email,
      password,
      firstname,
      lastname
    }
  })
  const ts = Date.now() + 900000
  const expiratation = new Date(ts)
  let hours = expiratation.getHours()
  let minutes = expiratation.getMinutes()
  const code = await db.otp.create({
    data: {
      userId: user.id,
      expires: expiratation
    }
  })

  const verifyHtml = `
  <h3>Hej! ${user.firstname} ${user.lastname}</h3>
  <br>
  <p>Klicka på nedanstående länk för att verifera ditt konto</p>
  <br>
  <a href=${`${CLIENTURL}/verifiera?token=${code.id}`}> Verifiera Konto</a>
  <p>Länken går ut Klockan ${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(
    -2
  )}</p>
  `
  sendEmail({
    to: user.email,
    subject: 'Verifiera ditt konto',
    html: verifyHtml
  })

  return res.json({ message: 'Verification link sent to email' })
}

const verify = async (req, res) => {
  const { token } = req.query
  if (!token) {
    return res.status(400).json({ error: 'Invalid Token' })
  }

  console.log(token)
  let ts = Date.now()
  const dt = new Date(ts)
  const code = await db.otp.findFirst({
    where: {
      AND: [
        { id: token },
        {
          expires: {
            lte: dt
          }
        }
      ]
    }
  })
  if (!code) {
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
  return res.json({ message: 'Account Verified' })
}

module.exports = {
  verify,
  signup,
  signin
}