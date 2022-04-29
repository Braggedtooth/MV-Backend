const { StatusCodes } = require('http-status-codes')
const db = require('../db')
/* const permissions = require('../utils/permissions.json') */
/* const sendEmail = (res) => {
  res.status(StatusCodes.ACCEPTED).json({ message: 'An accound has been registered for you click here to verify', email: res.email })
} */
/**
 * Create a user
 * @returns {Promise<User>}
 * @param req
 * @param res
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
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      verified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!users)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "No users where found" }); 
  return users
}

const getUserById = async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.user.id }, select: { firstname: true, lastname: true, email: true, role: true } })

  return res.status(StatusCodes.OK).json({ data: user })
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
const editProfile = async (req, res) => {
  const { email, firstname, lastname } = req.body
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'Nothing changed' } })
  }

  if (email | lastname | firstname) {
    await db.user.update({
      where: { id: req.user.id },
      data: {
        email,
        firstname,
        lastname
      }
    })
    return res.status(StatusCodes.OK).json({ message: 'Account details updated' })
  }

  if (email && lastname && firstname) {
    await db.user.update({
      where: { id: req.user.id },
      data: {
        email,
        firstname,
        lastname
      }
    })
    return res.status(StatusCodes.OK).json({ message: 'Account details updated' })
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  deleteUserById,
  editProfile
}
