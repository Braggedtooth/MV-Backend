const jwt = require('jsonwebtoken')
const { secret, expirationJwt } = require('../config')
const timestamp = new Date().getTime()


const generateToken = (user) => {
  return jwt.sign(
    { algorithm: 'HS256', sub: user.id, role: user.role, iat: timestamp },
    secret,
    { expiresIn: '30m' }
  )
}

module.exports = generateToken
