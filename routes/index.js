const Authentication = require('../controller/auth.controller')
const passport = require('passport')
const { login } = require('../middleware/login.middleware')
require('../services/passport')
const validator = require('../middleware/validator')
const requireAuth = passport.authenticate('jwt', { session: false })
const { Login, Signup } = require('../validation/validationSchemas')
const loginMidware = login
const adminRoutes = require('./admin.routes')
const userRoutes = require('./user.routes')
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send('ESRA SERVER')
  })

  app.use('/user', requireAuth, userRoutes)
  app.post('/signup', validator(Signup, 'body'), Authentication.signup)
  app.post('/signin', validator(Login, 'body'),
    loginMidware()
    , (req, res) => {
      Authentication.signin(req, res)
    }

  )
  app.use('/admin', requireAuth, adminRoutes)
}
