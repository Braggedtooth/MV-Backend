const { date } = require('zod')
const db = require('../db')
const metaDataService = () => {
  /**
  *
  * @param {*} companyId
  * @returns  Count of reviews in a company collection
  */
  const getTotalAmountOfReviews = async (companyId) => {
    const company = db.company.findFirst({ where: { id: companyId } })
    let amountOfviews = 0
    company.agents.map((agent) => {
      db.review.findFirst({
        where: {
          realtorsId: agent.id
        }

      })
      return amountOfviews++
    })
    return amountOfviews
  }
  /**
   *
   * @param {*} companyId
   * @returns adds ammount of reviews to company collections
   */
  const addReviewCount = async (companyId) => {
    const TotalReviews = getTotalAmountOfReviews(companyId)
    return await db.company.update({
      where: {
        id: companyId
      },
      data: {
        total_company_reviews: TotalReviews,
        updated_at: date.now()
      }
    })
  }

  return {
    getTotalAmountOfReviews,
    addReviewCount
  }
}
const realtorAverageRating = async (realtorId) => {
  const realtor = await db.realtors.aggregate({
    _avg: {
      reviews: {
        rating: true
      }
    },
    where: {
      id: realtorId
    }
  }
  )

  return realtor
}
module.exports = {
  metaDataService,
  realtorAverageRating
}
