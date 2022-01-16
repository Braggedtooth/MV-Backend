const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const db = require('../db')

function tokenForUser (user) {
  const timestamp = new Date().getTime()
  return jwt.sign({ sub: user.id, iat: timestamp }, secret)
}

exports.signin = function (req, res) {
  const payload = {
    userId: req.user.id,
    expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS)
  }
  req.login(payload, { session: false }, (error) => {
    if (error) res.status(400).send({ message: error })
    /** generate a signed json web token and return it in the response */
    const token = tokenForUser(req.user)

    /** assign our jwt to the cookie */
    res.cookie('jwt', token, { httpOnly: true, secure: true })
    console.log(token)
    res.status(200).send({ token: token, user: req.user })
  })
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

  const user = await db.user.create({
    data: {
      email,
      password,
      firstname,
      lastname
    }
  })

  return res.json({ message: 'Account Succesfully Created' })
}
