const lines = require('./lines')

// make sure cols are long enough for all elements or have default cols available
module.exports = (columns = [], id = undefined) => (
  (style = {}) => {
    const {cols = [], [id]: idCols = undefined} = style

    const length = columns.reduce((max, column) => Math.max(max, column.length), 0)

    const strings = []

    for (let i = 0; i < length; i++) {
      let string = ''

      for (let j = 0; j < columns.length; j++) {
        const text = columns[j][i] || ''

        const width    = ((idCols || cols)[j] || {}).width
        const padStart = ((idCols || cols)[j] || {}).padStart || 0
        const padEnd   = ((idCols || cols)[j] || {}).padEnd   || 0

        string += ''.padStart(padStart) + text.padEnd(width) + ''.padEnd(padEnd)
      }

      strings.push(string)
    }

    return lines(strings, id)(style)
  }
)