const { PrismaClient } = require('./prisma/node_modules/@prisma/client')
const express = require('express')
const app = express()
const grantWrite = require('./permissions')
const router = require('./routes')
const bodyParser = require('body-parser')
const prisma = new PrismaClient()
const port = 3103
const { config } = require('dotenv')
config({ path: '.env' })
const db = require('./db')
const cors = require('cors')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const { cookie_secret } = require('./config')

app.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
  res.json({ message: 'hello' }) })
app.use(express.json())
app.use(cookieParser(cookie_secret))
app.use(express.urlencoded ({ extended: true })) 
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))
app.use(passport.initialize())
router(app)
app.listen(port, () => console.log(
  `Example app listening on port ${port}!`

))
