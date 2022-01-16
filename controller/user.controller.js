const { StatusCodes } = require('http-status-codes')
const db = require('../db')
/* const permissions = require('../utils/permissions.json') */
/* const sendEmail = (res) => {
  res.status(StatusCodes.ACCEPTED).json({ message: 'An accound has been registered for you click here to verify', email: res.email })
} */
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (req, res) => {
  const { email, password, firstname, lastname } = req.body

  if (!email || !password) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .send({ error: 'Email and password must be provided' })
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: email
    }
  })

  if (existingUser) {
    return res.status(StatusCodes.FORBIDDEN).json({ error: 'Email is already in use...' })
  }

  const newUser = await db.user.create({
    data: {
      email,
      password,
      firstname,
      lastname
    }
  })
  return newUser
}

const getAllUsers = async (_, res) => {
  const users = await db.user.findMany({
    include: { reviews: true }
  })
  if (!users) return res.status(StatusCodes.NOT_FOUND).json({ error: 'No users where found' })
  return users
}

const getUserById = async (id) => {
  return db.user.findUnique({ where: { id } })
}

/* const updateUserById = async (id, updateBody) => {

  })
  return user
} */
const getUserByEmail = (email) => {
  const user = db.user.findFirst({ where: { email } })
  return user
}
const deleteUserById = async (id) => {
  const user = await db.user.delete({
    where: { id: id }
  })
  return user
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  deleteUserById
}