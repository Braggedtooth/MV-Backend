const { StatusCodes, getReasonPhrase } = require('http-status-codes')
const validator = (schema, property) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req[property])
      return next()
    } catch (error) {
      const { issues } = error
      const message = issues.map(i => i.message).join(',')
      const path = issues.map(i => i.path).join(',')
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: message, path: path, reason: getReasonPhrase(422) })
    }
  }
}

module.exports = validator
