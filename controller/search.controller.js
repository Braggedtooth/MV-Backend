
const { StatusCodes, getReasonPhrase } = require('http-status-codes')
const { searchRealtorsByName } = require('../controller/realtor.controller')

const searchRealtors = async (req, res) => {
  const query = req.query.query
  if (!query) {
    return res
      .status(StatusCodes.ACCEPTED)
      .json({ message: 'search with a firstname or lastname' })
  }
  try {
    const realtors = await searchRealtorsByName(query)
    if (realtors.length === 0) {
      return res
        .status(StatusCodes.ACCEPTED)
        .json({ message: 'No result found for ' + query })
    }
    return res.status(StatusCodes.ACCEPTED).json(realtors)
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: getReasonPhrase(400), error: JSON.parse(error.message) })
  }
}

module.exports = searchRealtors
