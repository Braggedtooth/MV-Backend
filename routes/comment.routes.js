const express = require('express')
const {
  newComment,
  deleteComment
} = require('../controller/comments.controller')
const router = express.Router()

router.post('/create', newComment)
router.delete('/delete', deleteComment)

module.exports = router
