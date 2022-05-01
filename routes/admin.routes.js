const express = require('express')
const { StatusCodes } = require('http-status-codes')
const {
  createUser,
  getAllUsers,
  deleteUserById,
  changeUserRole,
  requestDelete,
  activateAccount,
  banUser
} = require('../controller/user.controller')
const validator = require('../middleware/validator')
const { Signup } = require('../validation/validationSchemas')
const router = express.Router()
router.use(function admin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'You do not have the permmision to do that' })
  }
  next()
})
router.post('/add-user', validator(Signup, 'body'), async (req, res) => {
  const user = await createUser(req, res)
  return res.json({ message: 'Account Created' })
})
router.get('/all-users', async (req, res) => {
  const users = await getAllUsers(req, res)
  return res.status(StatusCodes.OK).json({ users: users })
})
router.put('/delete-user', async (req, res) => {
  const { id } = req.body
  await deleteUserById(id)
  return res
    .status(StatusCodes.OK)
    .json({ message: 'User account has been deleted' }) //create support mail
})
router.put('/request-delete', async (req, res) => {
  const id = req.body.id
  await requestDelete(id)
  return res
    .status(StatusCodes.OK)
    .json({ message: 'User account submitted for deletion' }) //create support mail
})
router.put('/ban-user', async (req, res) => {
  const id = req.body.id
  await banUser(id)
  return res
    .status(StatusCodes.OK)
    .json({ message: 'User account has been banned' }) //create support mail
})

router.put('/activate-user', async (req, res) => {
  const id = req.body.id
  await activateAccount(id)
  return res
    .status(StatusCodes.OK)
    .json({ message: 'User account has been activated' })
})

router.put('/change-role', async (req, res) => {
  const { id } = req.body
  await changeUserRole(id)
  return res.status(StatusCodes.OK).json({ message: 'User Role changed ' })
})

module.exports = router
