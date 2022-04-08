const express = require('express')
const { createReview, updateReview, deleteReview, reviewById, togglePublish, allReviews } = require('../controller/review.controller')
const validator = require('../middleware/validator')
const { EditReview, WriteReview } = require('../validation/validationSchemas')
const router = express.Router()

router.post('/create', validator(WriteReview, 'body'), async (req, res) => { createReview(req, res) })
router.post('/edit', validator(EditReview, 'body'), async (req, res) => { updateReview(req, res) })
router.patch('/publish', async (req, res) => { togglePublish(req, res) })
router.delete('/delete/', async (req, res) => { deleteReview(req, res) })
router.get('/review', async (req, res) => { reviewById(req, res) })
router.get('/all', async (req, res) => { allReviews(req, res) })

module.exports = router
