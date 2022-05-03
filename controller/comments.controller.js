const { StatusCodes } = require('http-status-codes')
const db = require('../db')
const ProfanityService = require('../services/profanity.service')
/**
 *
 * @param {[body:{content, reviewId}]} req express req object
 * @param {*} res express res object
 * @returns Creates new comment
 */
const newComment = async (req, res) => {
  const { content, reviewId } = req.body
  const { id, firstname } = req.user
  const commentTosave = ProfanityService.clean(content)
  if (!content | !reviewId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Missing comment content and review id' })
  }
  const commentExists = await db.comment.findFirst({
    where: {
      content: {
        equals: commentTosave
      }
    },
    select: { id: true, authorId: true, reviewId: true }
  })
  if (commentExists) {
    if (reviewId === commentExists.reviewId && id === commentExists.authorId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: 'No duplicate comments allowed' })
    }
  }
  const comment = await db.comment.create({
    data: {
      authorId: id,
      authorName: firstname,
      reviewId: reviewId,
      content: commentTosave
    }
  })
  if (!comment) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Failed to save comment' })
  }
  return res
    .status(StatusCodes.CREATED)
    .json({ message: 'Comment Saved', comment })
}

/**
 *
 * @param {[body:{id}]} req express req object
 * @param {*} res express res object
 * @returns Deletes Comment
 */
const deleteComment = async (req, res) => {
  const { id } = req.body
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: 'Missing Comment Id' })
  }
  const comment = await db.comment.findUnique({
    where: {
      id: id
    },
    select: { authorId: true }
  })
  if (!comment) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Comment not found' })
  }
  if (comment.authorId !== req.user.id && req.user.role !== 'ADMIN') {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Cant delete this comment' })
  }
  if (comment.authorId === req.user.id || req.user.role === 'ADMIN') {
    await db.comment.delete({
      where: {
        id: id
      }
    })
    res.status(StatusCodes.OK).json({ message: 'Comment Deleted' })
  }
  return
}
module.exports = {
  newComment,
  deleteComment
}
