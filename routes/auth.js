const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const keys = process.env.SECRET
const db = require('../db')
const login = require('../controller/auth')
const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, password, firstname, lastname } = req.body
  const hashCost = 4

  try {
    const passwordHash = await bcrypt.hash(password, hashCost)
    const User = await db.user.create({ data: { email, password: passwordHash, firstname, lastname } })
    res.status(200).json({ success: true, user: User })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
      message: 'Request failed please complete the required details'
    })
  }
})
router.post('/login', (req, res) => { login(req, res) })

router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: 'You are successfully authenticated to this route!'
    })
  }
)

module.exports = router
