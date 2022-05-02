const express = require('express')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')
const db = require('../db')
router.get('/', async (req, res) => {
  const { id } = req.query
  const verify = await db.otp.findFirst({
    where: {
      id: { id }
    },
    select: { userId: true }
  })
  if (!verify)
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Wrong code' })

  const user = await db.user.findFirst({
    where: {
      id: { verify }
    },
    select: { id: true }
  })
  if (!user)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid user account' })
  await db.user.update({
    where: {
      id: { user }
    },
    data: {
      verified: true
    }
  })
  await db.otp.delete({
    where: { id: id }
  })
  res.status(200).json({ message: 'you have been verified' })
})
module.exports = router
