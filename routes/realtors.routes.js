const express = require('express')
const { StatusCodes, getReasonPhrase } = require('http-status-codes')
const { searchRealtorsByName, getAllRealtor, getRealtorsInCompany, getRealtorById } = require('../controller/realtor.controller')

const router = express.Router()

router.get('/', async (_req, res) => {
  try {
    const realtors = await getAllRealtor()
    return res.status(StatusCodes.ACCEPTED).json({ realtors })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: getReasonPhrase(400), error: error })
  }
})
router.get('/get', async (req, res) => {
  const realtorId = req.query.realtorId
  try {
    const realtors = await getRealtorById(realtorId)
    if (!realtors) {
      return res.status(StatusCodes.ACCEPTED).json({ message: 'No realtor with that id exist' })
    }
    return res.status(StatusCodes.ACCEPTED).json({ realtors })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: getReasonPhrase(400), error: error.message })
  }
})

router.get('/search', async (req, res) => {
  const query = req.query.query
  if (!query) {
    return res.status(StatusCodes.ACCEPTED).json({ message: 'search with a firstname or lastname' })
  }
  try {
    const realtors = await searchRealtorsByName(query)
    if (realtors.length === 0) {
      return res.status(StatusCodes.ACCEPTED).json({ message: 'No result found for ' + query })
    }
    return res.status(StatusCodes.ACCEPTED).json({ realtors })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: getReasonPhrase(400), error: JSON.parse(error.message) })
  }
})

/* router.get('/c', async (req, res) => {
  const { companyId } = req.body
  try {
    const company = await getCompany(companyId)
    return res.status(StatusCodes.ACCEPTED).json({ company })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: getReasonPhrase(400), error: error })
  }
}) */

router.get('/c', async (req, res) => {
  const companyId = req.query.companyId
  try {
    const company = await getRealtorsInCompany(companyId)
    return res.status(StatusCodes.ACCEPTED).json({ company })
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: getReasonPhrase(400), error: error })
  }
})

module.exports = router
