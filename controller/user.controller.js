import httpStatus from 'http-status';
import ApiError from '../utils/errorConstructor';
import   validator  from '../middleware/validator';
const db = require("./db")
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */

const createUser = ()=> { 
 
}
const getAllUsers = async () => {
  const users = await db.user.findMany({
    include: { reviews: true }
  })
  return users
}

const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const updateUserById = async (id, updateBody) => {
   await validator(updateBody,"body")
  const user = await prisma.user.findFirst({ where: { id } })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const checkMail = await prisma.user.findFirst({ where: { email } })
  if (email && (!checkMail)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const bufferPassword = Buffer.from(password)
  const hashedPassword = await PasswordMan.hash(bufferPassword)

  await prisma.user.update({
    where: { id }, data: {
      email: email,
      firstName: firstname,
      lastName: lastname,
      hashedPassword: hashedPassword.toString()
    }
  })
  return user;
};
const getUserByEmail = (email) => {
  const user = prisma.user.findFirst({ where: { email } })
  return user
}
const deleteUserById = async (id) => {
  const user = await prisma.user.delete({
    where: { id: id },
  })
  return user
}

export {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
