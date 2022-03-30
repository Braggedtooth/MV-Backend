const { date } = require('zod')
const db = require('../db')
const metaDataService = () => {
  const getTotalAmountOfReviews = async (company) => {
    let amountOfviews
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
  const addReviewCount = async (company) => {
    const TotalReviews = getTotalAmountOfReviews(company)
    await db.company.update({
      where: {
        id: company.id
      },
      data: {
        metadata: {
          total_company_reviews: TotalReviews,
          updated_at: date.now()
        }
      }
    })
  }

  return {
    getTotalAmountOfReviews,
    addReviewCount
  }
}

export default metaDataService
