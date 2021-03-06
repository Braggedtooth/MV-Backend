const Authentication = require('../controller/auth.controller')
const passport = require('passport')
const { login } = require('../middleware/login.middleware')
require('../utils/passport')
const validator = require('../middleware/validator')
const requireAuth = passport.authenticate('jwt', { session: false })
const { Login, Signup } = require('../validation/validationSchemas')
const realtorRoutes = require('./realtors.routes')
const reviewRoutes = require('./review.routes')
const adminRoutes = require('./admin.routes')
const userRoutes = require('./user.routes')
const commentRoutes = require('./comment.routes')
const searchRealtors = require('../controller/search.controller')
const loginMiddleware = login
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send('ESRA SERVER')
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
  app.get('/verify-account', Authentication.verify)
  app.use('/comments', requireAuth, commentRoutes)
  app.use('/reviews', requireAuth, reviewRoutes)
  app.use('/admin', requireAuth, adminRoutes)
  app.use('/realtor', requireAuth, realtorRoutes)
  app.get('/r/search', (req, res) => {
    searchRealtors(req, res)
  })
}
