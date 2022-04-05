const express = require('express')
const app = express()
const router = require('./routes')
const port = 3103
const { config } = require('dotenv')
config({ path: '.env' })
const cors = require('cors')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const { cookieSecret } = require('./config')

app.use(express.json())
app.use(cookieParser(cookieSecret))
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(passport.initialize())
router(app)
app.listen(port, () => console.log(
  `Example app listening on port ${port}!`

))
