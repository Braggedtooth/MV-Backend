const { PrismaClient } = require('@prisma/client')
const { hashPassword } = require('./utils/password')

const prisma = new PrismaClient()

module.exports = prisma

/**
 * @description middleware to initialize db and auto hash password on create requests on the user model
 */
async function main () {
  prisma.$use(async (params, next) => {
    if (params.model === 'User') {
      if (params.action === 'create') {
        params.args.data.password = await hashPassword(
          params.args.data.password
        )
      }
    }
    return next(params)
  })
}

main()
