const db = require('../db')
const generateToken = require('../utils/generateToken')
/* const permissions = require('../utils/permissions') */

exports.signin = async (req, res) => {
  const expires = parseInt(process.env.JWT_EXPIRATION_MS)
  /** generate a signed json web token and return it in the response */
  const User = await db.user.findUnique({
    where: {
      email: req.body.email
    }
  })
  const token = generateToken(User)
  /** assign  jwt to the cookie */
  res.cookie('jwt', token, {
    signed: true,
    httpOnly: true,
    secure: true,
    maxAge: expires
  })

  res.status(200).send({ message: 'Succesfully logged in', error: '', data: token })
}

exports.signup = async (req, res, next) => {
  const { email, password, firstname, lastname } = req.body

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'Email and password must be provided' })
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: email
    }
  })

  if (existingUser) {
    return res.status(422).send({ error: 'Email is aleready in use...' })
  }

  await db.user.create({
    data: {
      email,
      password,
      firstname,
      lastname
    }
  })
  /* await db.permissions.create({
    data: {
      permit: [permissions.READ],
      userId: user.id
    }
  }) */

  return res.json({ message: 'Account Succesfully Created' })
}
