const { comparePasswords } = require('../utils/password')
const { StatusCodes, getReasonPhrase } = require('http-status-codes')
const db = require('../db')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const { signedCookie } = require('cookie-parser')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(req.body)
    const User = await db.user.findUnique({
      where: {
        email: email
      },
      select: { id: true, password: true, email: true }
    })
    if (!User) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'enter a valid email and password combination',
        error: getReasonPhrase(401)
      })
    }
    const correctPassword = await comparePasswords(password, User.password)
   
    if (correctPassword) {
      const expires =parseInt(process.env.JWT_EXPIRATION_MS)
      function tokenForUser (user) {
        const timestamp = new Date().getTime() 
        return jwt.sign({ algorithm: 'HS256', sub: User.id, iat: timestamp , exp: expires}, secret)
      }
      /** generate a signed json web token and return it in the response */
      console.log(expires);
      const token = tokenForUser(User)

      /** assign  jwt to the cookie */
    res.cookie('jwt', token,  { signed:true,httpOnly: true, 
       secure: true , maxAge:expires }  ) 
      console.log(token) 
      res.status(200).send({ message: "Succesfully logged in" ,error:"" , data : token })
    } else {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: getReasonPhrase(401),
        message: 'Incorrect password'
      })
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: getReasonPhrase(400),
      error: error
    })
  }
}
