const express = require('express')
const { StatusCodes, getReasonPhrase } = require('http-status-codes')
const {
  getAllRealtor,
  getRealtorsInCompany,
  getRealtorById
} = require('../controller/realtor.controller')
const prisma = require('../db')

const router = express.Router()

router.get('/', async (_req, res) => {
  try {
    const realtors = await getAllRealtor()
    return res.status(StatusCodes.ACCEPTED).json({ realtors })
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: getReasonPhrase(400) })
  }
})
router.get('/get', async (req, res) => {
  const realtorId = req.query.realtorId
  try {
    const realtors = await getRealtorById(realtorId)
    if (!realtors) {
      return res
        .status(StatusCodes.ACCEPTED)
        .json({ message: 'No realtor with that id exist' })
    }
    return res.status(StatusCodes.ACCEPTED).json({ realtors })
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: getReasonPhrase(400) })
  }
})

router.get('/calculateAvgRating', async (req, res) => {
  const realtorId = req.query.realtorId
  const averageRating = await prisma.review.aggregate({
    _avg: {
      rating: true
    },
    where: {
      realtorsId: realtorId
    }
  })

  try {
    const realtor = await prisma.realtors.update({
      where: {
        id: realtorId
      },
      data: {
        averageRating: averageRating._avg.rating
      }
    })
    return res.status(StatusCodes.ACCEPTED).json(realtor)
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: getReasonPhrase(400) })
  }
})

router.get('/company', async (req, res) => {
  const companyId = req.query.companyId
  try {
    const company = await getRealtorsInCompany(companyId)
    return res.status(StatusCodes.ACCEPTED).json({ company })
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: getReasonPhrase(400) })
  }
})

module.exports = router
