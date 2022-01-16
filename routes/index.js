const Authentication = require('../controller/auth.controller')
const passport = require('passport')
const { login } = require('../middleware/login.middleware')
require('../services/passport')
const validator = require('../middleware/validator')
const requireAuth = passport.authenticate('jwt', { session: false })
const { Login, Signup } = require('../middleware/validationSchemas')
const loginMidware = login
const adminRoutes = require('./user.routes')
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send('ESRA SERVER')
  })

  app.get('/user', requireAuth, function (req, res) {
    res.json({ user: req.user.email })
  })

  app.post('/signin', validator(Login, 'body'),
    loginMidware()
    , (req, res) => {
      Authentication.signin(req, res)
    }

  )
  app.use('/admin', requireAuth, adminRoutes)
  app.post('/signup', validator(Signup, 'body'), Authentication.signup)
}
