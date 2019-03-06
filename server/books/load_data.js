const fs = require('fs')
const path = require('path')
const { client } = require('../es/connection')
const indexes = require('../es/indexes')
const types = require('../es/types')

let index = indexes.LIBRARY
let type = types.NOVEL

async function readAndInsertBooks() {
  try {
    await resetIndex()

    let files = fs.readdirSync('./books').filter(file => file.slice(-4) === '.txt')
    console.log(`Found ${files.length} Files`)

    for (let file of files) {
      console.log(`Reading File - ${file}`)
      const filePath = path.join('./books', file)
      const book = fs.readFileSync(filePath, 'utf8')
      await parseAndInsertBook(book);
    }
  } catch (err) {
    console.error(err)
  }
}

readAndInsertBooks()

async function resetIndex() {
  if (await client.indices.exists({ index })) {
    await client.indices.delete({ index })
  }

  await client.indices.create({ index })
  await putBookMapping()
}

async function putBookMapping() {
  const schema = {
    title: { type: 'keyword' },
    author: { type: 'keyword' },
    location: { type: 'integer' },
    text: { type: 'text' }
  }

  return client.indices.putMapping({ index, type, body: { properties: schema } })
}

async function parseAndInsertBook(book) {
  const {title, author, paragraphs} = parseBookFile(book)
  await insertBookData(title, author, paragraphs)
}

function parseBookFile (book) {
  console.log(book)
  const title = book.match(/^Title:\s(.+)$/m)[1]
  const authorMatch = book.match(/^Author:\s(.+)$/m)
  const author = (!authorMatch || authorMatch[1].trim() === '') ? 'Unknown Author' : authorMatch[1]

  console.log(`Reading Book - ${title} By ${author}`)

  const startOfBookMatch = book.match(/^\*{3}\s*START OF (THIS|THE) PROJECT GUTENBERG EBOOK.+\*{3}$/m)
  const startOfBookIndex = startOfBookMatch.index + startOfBookMatch[0].length
  const endOfBookIndex = book.match(/^\*{3}\s*END OF (THIS|THE) PROJECT GUTENBERG EBOOK.+\*{3}$/m).index

  const paragraphs = book
    .slice(startOfBookIndex, endOfBookIndex)
    .split(/\n\s+\n/g)
    .map(line => line.replace(/\r\n/g, ' ').trim())
    .map(line => line.replace(/_/g, ''))
    .filter((line) => (line && line !== ''))

  console.log(`Parsed ${paragraphs.length} Paragraphs\n`)
  return { title, author, paragraphs }
}

async function insertBookData(title, author, paragraphs) {
  let bulkOps = []

  for (let i = 0; i < paragraphs.length; i++) {
    bulkOps.push({ index: { _index: index, _type: type } })

    bulkOps.push({
      author,
      title,
      location: i,
      text: paragraphs[i]
    })

    if (i > 0 && i % 500 === 0) {
      await client.bulk({ body: bulkOps })
      bulkOps = []
      console.log(`Indexed Paragraphs ${i - 499} - ${i}`)
    }
  }

  await client.bulk({ body: bulkOps })
  console.log(`Indexed Paragraphs ${paragraphs.length - (bulkOps.length / 2)} - ${paragraphs.length}\n\n\n`)
}

module.exports = {
  parseAndInsertBook
}
