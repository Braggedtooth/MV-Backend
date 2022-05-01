const Authentication = require('../controller/auth.controller')
const passport = require('passport')
const { login } = require('../middleware/login.middleware')
require('../services/passport')
const validator = require('../middleware/validator')
const requireAuth = passport.authenticate('jwt', { session: false })
const { Login, Signup } = require('../validation/validationSchemas')
const realtorRoutes = require('./realtors.routes')
const reviewRoutes = require('./review.routes')
const verifyRoutes = require('./verify')
const adminRoutes = require('./admin.routes')
const userRoutes = require('./user.routes')
const searchRealtors = require('../controller/search.controller')
const loginMiddleware = login
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send('ESRA SERVER')
  })

  app.delete('/logout', function (req, res) {
    res.clearCookie('jwt')
    return res.status(200).json({ message: 'Logged out' })
  })
  app.use('/user', requireAuth, userRoutes)
  app.post('/signup', validator(Signup, 'body'), Authentication.signup)
  app.post(
    '/signin',
    validator(Login, 'body'),
    loginMiddleware(),
    (req, res) => {
      Authentication.signin(req, res)
    }
  )
  app.use('/verify', verifyRoutes)
  app.use('/reviews', requireAuth, reviewRoutes)
  app.use('/admin', requireAuth, adminRoutes)
  app.use('/realtor', requireAuth, realtorRoutes)
  app.get('/r/search', (req, res) => {
    searchRealtors(req, res)
  })
}
