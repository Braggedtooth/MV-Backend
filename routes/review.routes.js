const express = require('express')
const { createReview, updateReview, deleteReview, allReviewsByUser, togglePublish } = require('../controller/review.controller')
const { getUserById, editProfile } = require('../controller/user.controller')
const validator = require('../middleware/validator')
const { EditReview, WriteReview } = require('../validation/validationSchemas')
const router = express.Router()


router.post('/create', validator(WriteReview, 'body'), async (req, res) => { createReview(req, res) })
router.post('/edit', validator(EditReview, 'body'), async (req, res) => { updateReview(req, res) })
router.patch('/publish', async (req, res) => { togglePublish(req, res) }) 
router.delete('/delete/', async (req, res) => { deleteReview(req, res) })


module.exports = router
