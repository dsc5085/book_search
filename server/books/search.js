const { client } = require('../es/connection')
const indexes = require('../es/indexes')
const types = require('../es/types')

let index = indexes.LIBRARY
let type = types.NOVEL

module.exports = {
  queryTerm (term, offset = 0) {
    const body = {
      from: offset,
      query: { match: {
        text: {
	  query: term,
	  operator: 'and',
	  fuzziness: 'auto'
	} } },
      highlight: { fields: { text: {} } }
    }

    return client.search({ index, type, body })
  },

  getParagraphs(bookTitle, startLocation, endLocation) {
    const filter = [
      { term: { title: bookTitle } },
      { range: { location: { gte: startLocation, lte: endLocation } } }
    ]

    const body = {
      size: endLocation - startLocation,
      sort: { location: 'asc' },
      query: { bool: { filter } }
    }

    return client.search({ index, type, body })
  }
}
