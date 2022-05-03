const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { secret } = require('../config')
const db = require('../db')
const { StatusCodes } = require('http-status-codes')
const { ExtractJwt } = require('passport-jwt')

/**
 * @description extracts cookies from request
 * @param {*} req
 * @returns token
 */

/* const cookieExtractor = function (req) {
  let token = null
  if (req && req.signedCookies && req.signedCookies.jwt) {
    token = req.signedCookies.jwt
  } else {
    if (req && req.cookies) token = req.cookies.jwt
  }

  return token
} */

// define the jwt strategy

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
  },
  async (jwtPayload, done) => {
    if (jwtPayload.algorithm !== 'HS256') {
      return done(StatusCodes.UNAUTHORIZED, null, 'Invalid Token')
    }
    const user = await db.user.findUnique({
      where: {
        id: jwtPayload.sub
      }
    })
    if (!user) {
      done(StatusCodes.NOT_FOUND, false, 'User not found')
    }
    done(null, user, StatusCodes.OK)
  }
)

// use defined strategies:
passport.use(jwtLogin)
