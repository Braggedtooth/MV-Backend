const express = require('express')
const { createReview, updateReview, deleteReview, allReviewsByUser } = require('../controller/review.controller')
const { getUserById } = require('../controller/user.controller')
const validator = require('../middleware/validator')
const { EditReview, WriteReview } = require('../validation/validationSchemas')
const router = express.Router()

router.get('/me', async (req, res) => { getUserById(req, res) })
router.post('/createreview', validator(WriteReview, 'body'), async (req, res) => { createReview(req, res) })
router.post('/editreview', validator(EditReview, 'body'), async (req, res) => { updateReview(req, res) })
router.get('/alluserreviews', async (req, res) => { allReviewsByUser(req, res) })
router.delete('/deletereview/', async (req, res) => { deleteReview(req, res) })

module.exports = router
