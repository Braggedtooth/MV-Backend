const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const bcrypt = require('bcrypt')
const db = require('../db')
const secret = process.env.SECRET
if (!secret) console.log('PLEASE PUT SECRET IN THE ENV TO CONTINUE')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'

}, { session: false }, async (email, password, next) => {
  console.log(email, password)
  try {
    const User = await db.user.findUnique({ where: { email: email } })
    console.log(User)
    if (!User) return next(null, 'No User Found')
    const passwordsMatch = await bcrypt.compare(password, User.password)
    if (passwordsMatch) {
      return next(null, User)
    } else {
      return next('Incorrect Username / Password')
    }
  } catch (error) {
    next(error, 'No User Found')
  }
}))

passport.use(new JWTStrategy({
  jwtFromRequest: req => req.cookies.jwt,
  secretOrKey: secret
},
(jwtPayload, next) => {
  if (Date.now() > jwtPayload.expires) {
    return next('jwt expired')
  }
  return next(null, jwtPayload)
}
))
