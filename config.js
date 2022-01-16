require('dotenv/config')

module.exports = {
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  expirationJwt: process.env.JWT_EXPIRATION_MS
}
