const express = require('express')
const { StatusCodes } = require('http-status-codes')
const { createUser, getAllUsers, deleteUserById } = require('../controller/user.controller')
const validator = require('../middleware/validator')
const { Signup } = require('../validation/validationSchemas')
const router = express.Router()
router.use(function admin (req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You do not have the permmision to do that' })
  }
  next()
})
router.post('/addUser', validator(Signup, 'body'), async (req, res) => {
  const user = await createUser(req, res)
  return res.status(StatusCodes.OK).json({ user: user })
})
router.get('/listUsers', async (req, res) => {
  const users = await getAllUsers(req, res)
  return res.status(StatusCodes.OK).json({ users: users })
})
router.delete('/deleteuser/', async (req, res) => {
  const id = req.query.id || req.body.id
  await deleteUserById(id)
  return res.status(StatusCodes.OK).json({ message: 'User deleted' })
})

module.exports = router
