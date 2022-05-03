const { PrismaClient } = require('@prisma/client')
const { realtorAverageRating } = require('./services/metadata.service')
const { hashPassword } = require('./utils/password')

const prisma = new PrismaClient()

module.exports = prisma

/**
 * @description middleware to initialize db and auto hash password on create requests on the user model
 * also calculates average ratings for realtors whenever a new review is created.
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
    if (params.model === 'Review') {
      if (params.action === 'create') {
        const averageRating = await prisma.review.aggregate({
          _avg: {
            rating: true
          },
          where: {
            realtorsId: params.args.data.realtorsId
          }
        }
        )
        await prisma.realtors.update({
          where: {
            id: params.args.data.realtorsId
          },
          data: {
            averageRating: averageRating._avg.rating || 0
          }
        })
      }
    }
    return next(params)
  })
}

main()
