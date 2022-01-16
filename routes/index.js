const Authentication = require('../controller/authentication')
const passport = require('passport')
const { login } = require('../middleware/LoginMiddleware')
require('../services/passport')

const requireAuth = passport.authenticate('jwt', { session: false }) 
/* const requireSignIn = passport.authenticate('local', { session: false }) */
const loginMidware = login


module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send('ESRA SERVER')
  })

   app.get('/user', requireAuth, function (req, res) {
     console.log(req);
    res.send({ user: req.user.email})
  })
 
  app.post('/signin', function (req, res) {
     loginMidware(req, res) 
    console.log(req.body);
  })

  app.post('/signup', Authentication.signup)
}
