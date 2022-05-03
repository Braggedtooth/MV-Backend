const Filter = require('bad-words')
const filter = new Filter()

const ProfanityService = {
  clean: (content) => filter.clean(content),
  check: (content) => filter.isProfane(content)
}
module.exports = ProfanityService
