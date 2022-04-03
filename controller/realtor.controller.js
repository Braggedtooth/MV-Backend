const db = require('../db')

/**
 *
 * @param {*} queryName
 * @returns a collection of realtors where the first name or last name matches query
 */
const searchRealtorsByName = (queryName) => {
  const realtors = db.realtors.findMany({
    where: {
      OR: [
        {
          firstname: {
            startsWith: queryName
          }
        },
        {
          lastname: {
            startsWith: queryName
          }
        }
      ]

    },
    take: 100

  })
  return realtors
}

/**
 *
 * @param {*} companyName
 * @returns a collection of realtors that belong to queried company name
 */
const searchRealtorsByCompany = async (companyName) => {
  const realtors = await db.realtors.findMany({
    where: {
      companyId: {
        contains: companyName
      },
      orderBy: {
        registrationdate: 'asc'
      }
    }

  })
  return realtors
}

/**
 *
 * @param {*} city
 * @returns a collection of companies sorted by city or by name in ascending order
 */
const getAllCompanies = async (city) => {
  if (city) {
    const companies = await db.company.findMany(
      {
        where: {
          city: {
            contains: city
          }
        },
        orderBy: {
          name: 'asc'
        }
      }
    )
    return companies
  }
  const companies = await db.company.findMany({
    orderBy: {
      name: 'asc'
    }
  })
  return companies
}
/**
 *
 * @returns a collection of private companies
 */
const getPrivateCompanies = async () => {
  const isPrivate = await db.realtors.findMany({
    where: {
      companyName: {
        equals: null
      }
    },
    select: {
      faction: true
    }
  })
  return isPrivate
}
/**
 *
 * @returns a collection of all realtors
 */
const getAllRealtor = async () => {
  const realtors = await db.realtors.findMany({
    orderBy: {
      registrationdate: 'asc'
    }
  })
  return realtors
}
/**
 *
 * @param {*} companyId
 * @returns returns companies a realtor belongs to [1]
 */
const getCompany = async (companyId) => {
/*   const realtors = await db.company.findMany({
    where: {
      agents: {
        every: {
          id: {
            contains: realtorId
          }
        }
      }
    } */
  const realtors = await db.company.findFirst({
    where: {
      id: companyId
    }
  })
  return realtors
}
/**
 *
 * @param {*} companyId
 * @returns a lst of agents registered to a company YAGNI?
 */
const getRealtorsInCompany = async (companyId) => {
  const realtors = await db.company.findFirst({
    where: {
      id: companyId
    },
    select: {
      agents: true
    }

  })
  return realtors
}

/**
 *
 * @param {*} realtorId
 * @returns Single realtor matching given id
 */
const getRealtorById = async (realtorId) => {
  const realtors = await db.realtors.findFirst({
    where: {
      id: realtorId
    },
    include: {
      reviews: true
    }

  })
  return realtors
}

module.exports = {
  getAllRealtor,
  getCompany,
  searchRealtorsByCompany,
  searchRealtorsByName,
  getAllCompanies,
  getRealtorsInCompany,
  getPrivateCompanies,
  getRealtorById
}
