const jwt = require('jsonwebtoken')
const { secret, expirationJwt } = require('../config')
const timestamp = new Date().getTime()
const expires = parseInt(expirationJwt)
const generateToken = (user) => {
  return jwt.sign({ algorithm: 'HS256', sub: user.id, role: user.role, iat: timestamp }, secret, { expiresIn: expires })
}

module.exports = generateToken
