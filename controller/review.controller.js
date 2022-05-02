const { metaDataService } = require('./../services/metadata.service')
const { StatusCodes } = require('http-status-codes')
const db = require('../db')


const createReview = async (req, res) => {
  const { title, content, realtorsId, rating } = req.body
  if (!title || !content) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: 'Title and content of a review must be provided' })
  }
  /*  const { addReviewCount } = metaDataService(); */
  const titleExists = await db.review.findFirst({
    where: { title: { equals: title }, realtorsId: { equals: realtorsId } }
  })
  const validRealtor = await db.realtors.findFirst({
    where: { id: realtorsId }
  })
  if (!validRealtor) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      data: { title, content },
      error: 'A valid realtorsid is required to write a review'
    })
  }
  if (titleExists) {
    return res.status(StatusCodes.CONFLICT).json({
      data: { title, content },
      error: 'A review with simalar title already exist'
    })
  }
  const authorId = req.user.id
  const authorName = req.user.firstname
  const review = await db.review.create({
    data: {
      title,
      content,
      authorId,
      authorName,
      realtorsId,
      rating
    }
  })
  /* .then(() => addReviewCount(validRealtor.companyId)); */

  return res
    .status(StatusCodes.CREATED)
    .json({ message: 'Review Created Sucessfully', data: review })
}

const updateReview = async (req, res) => {
  try {
    const { title, content, id } = req.body
    const checkReview = await db.review.findFirst({ where: { id: id } })

    if (!checkReview) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'A review with that id does not exist'
      })
    }
    if (checkReview.content === content || checkReview.title === title) {
      return res.status(StatusCodes.OK).json({
        error: 'Nothing changed in review'
      })
    }
    if (checkReview.authorId !== req.user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        data: { title, content },
        error: 'You can only update your own reviews'
      })
    }

    const review = await db.review.update({
      where: {
        id: id
      },
      data: {
        title: title,
        content: content
      }
    })
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Review Updated Sucessfully', data: review })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error
    })
  }
}

const deleteReview = async (req, res) => {
  const id = req.query.id || req.body.id
  const isUserReview = await db.review.findFirst({
    where: {
      authorId: req.user.id

    }
  })
  if (!isUserReview) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: 'You can only delete your own reviews'
    })
  }
  const hasComments = await db.comment.findMany({ where: { reviewId: id } })
  if (hasComments) {
    await db.comment.deleteMany({ where: { reviewId: id } })
  }

  await db.review.delete({
    where: { id: id }

  })
  return res.status(StatusCodes.OK).json({
    message: 'Review and related comments have been deleted'
  })
}

const allReviewsByUser = async (req, res) => {
  const reviews = await db.review.findMany({
    where: {
      authorId: {
        equals: req.user.id
      }

    },
    include: {
      comments: true
    }
  })
  return res.status(StatusCodes.OK).json({
    message: 'Reviews and related comments ',
    data: reviews
  })
}

const reviewById = async (req, res) => {
  const id = req.query.id
  console.log(id)
  if (!id) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid review id' })
  }

  const review = await db.review.findUnique({
    where: {
      id: id
    },
    include: {
      comments: true,
    }
  })
  return res.status(StatusCodes.OK).json({
    message: 'Review and related comments ',
    data:review
  })
}

const allReviews = async (req, res) => {
  const reviews = await db.review.findMany({
    where: {
      published: true
    }
  })
  return res.status(StatusCodes.OK).json({
    message: 'Reviews ',
    data: reviews
  })
}
const togglePublish = async (req, res) => {
  const id = req.query.id || req.body.id
  const review = await db.review.findFirst({
    where: { id: id },
    select: { published: true }
  })

  const toggleVal = (val) => {
    return !val
  }
  if (!review) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Review does not exists' })
  }
  await db.review.update({
    where: { id: id },
    data: {
      published: toggleVal(review.published)
    },
    select: { published: true, title: true }
  })
  return res.status(StatusCodes.OK).json({
    message: review.published
      ? 'Your review has been published'
      : 'Your review has been concealed'
  })
}

const reviewsByRealtorsId = async (req, res) => {
  const realtorId = req.query.realtorId
  if (!realtorId) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: 'Invalid realtors id' })
  }
  const realtor = await db.realtors.findUnique({
    where: {
      id: realtorId
    }
  })
  const reviews = await db.review.findMany({
    where: {
      realtorsId: realtorId
    },
    include: {
      comments: true
    }
  })
  return res.status(StatusCodes.OK).json({
    message: 'Realtors reviews and related comments ',
    data: { realtor, reviews }
  })
}
module.exports = {
  createReview,
  updateReview,
  allReviewsByUser,
  deleteReview,
  reviewById,
  allReviews,
  reviewsByRealtorsId,
  togglePublish

}
