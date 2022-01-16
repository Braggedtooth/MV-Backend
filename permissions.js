const db = require('./db')
const ApiError = require('./errorConstructor')

const permissions = {
  READ: 'read',
  WRITE_REVIEWS: 'Wrewiews',
  WRITE_COMMENTS: 'Wcomments',
  DELETE_COMMENTS: 'Dcomments',
  DELETE_REVIEWS: 'Dreviews',
  UPDATE_REVIEWS: 'UReviews',
  PUBLISH_REVIEWS: 'PReviews'
}

const grantWrite = async (userId) => {
  const user = await db.user.findUnique({ where: userId })
  if (user) {
    async () => {
      if (user.verified) {
        await db.permissions.create({
          data: {
            permit: [permissions.WRITE_REVIEWS, permissions.WRITE_COMMENTS, permissions.UPDATE_REVIEWS, permissions.PUBLISH_REVIEWS],
            userId: user.id
          }
        })
      } else throw new ApiError(401, 'Please Verify You Email address')
    }
  } else throw new ApiError(404, 'Please Login')
}
module.exports = grantWrite
