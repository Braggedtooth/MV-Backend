const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = process.env.SECRET
const db = require('../db')

const login = function (req, res) {
  if (!req.body.email) {
    res.json({ success: false, message: 'Username was not given' })
  } else {
    if (!req.body.password) {
      res.json({ success: false, message: 'Password was not given' })
    } else {
      passport.authenticate('local', { session: false, passReqToCallback: true }, function (error, User) {
        console.log(req.body)
        /* if(err){
   res.json({success: false, message: err})
   } else{
   if (! user) {
    res.json({success: false, message: 'username or password incorrect'})
   } else{
    req.login(user, function(err){
    if(err){
     res.json({success: false, message: err})
    }else{
     const token = jwt.sign({userId : user._id,
     username:user.username}, keys,
      {expiresIn: '24h'})
     res.json({success:true, message:{ Authentication:
      "successful",token: token }});
    }
    })
   }
   } */

        if (error || !User) {
          res.status(400).json({ sucess: false, message: error })
        }
        console.log(User)
        const payload = {
          /*  userId: User.id, */
          expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS)
        }

        /**
   *
   * @description assigns payload to req.user
   * */
        try {
          req.login(payload, { session: false }, (error) => {
            if (error) res.status(400).send({ message: error })
            /** generate a signed json web token and return it in the response */
            const token = jwt.sign(JSON.stringify(payload), keys.secret)

            /** assign our jwt to the cookie */
            res.cookie('jwt', token, { httpOnly: true, secure: true })
            res.status(200).send({ user: { username, token } })
          })
        } catch (error) {
          res.status(400).send({ error: error, message: 'Not Authorised' })
        }
      })(req, res)
    }
  }
}

module.exports = login
