const { StatusCodes, getReasonPhrase } = require('http-status-codes')
/**
 *
 * @param {{}} schema  validation schema
 * @param {string} property
 * @description validates request with provided schema
 * 
 */
const validator = (schema, property) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req[property])
      return next()
    } catch (error) {
      const { issues } = error
      /*     const message = issues.map((i) => i.message).join(",");
      const path = issues.map((i) => i.path).join(","); */
      res.status(StatusCodes.BAD_REQUEST).json({ error: issues })
    }
  }
}

module.exports = validator
