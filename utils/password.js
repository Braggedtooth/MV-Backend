const bcrypt = require('bcrypt')

const saltRounds = 10

/**
 * 
 * @param {string} plainPassword 
 * @returns hashedPassword
 */
const hashPassword = async (plainPassword) => {
  const hash = await bcrypt.hash(String(plainPassword), saltRounds)

  return hash
}
/**
 * 
 * @param {string} plainPassword 
 * @param {string} hashedPassword 
 * @returns Boolean
 */
const comparePasswords = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(String(plainPassword), hashedPassword)

  return isMatch
}

module.exports = {
  hashPassword,
  comparePasswords
}
