const express = require('express')
const { allReviewsByUser } = require('../controller/review.controller')
const { getUserById, editProfile } = require('../controller/user.controller')
const router = express.Router()

router.get('/me', async (req, res) => { getUserById(req, res) })
router.get('/my-reviews', async (req, res) => { allReviewsByUser(req, res) })
router.put('/edit-profile', async (req, res) => { editProfile(req, res) })

module.exports = router
