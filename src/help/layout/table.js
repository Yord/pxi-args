const cols = require('./cols')

module.exports = (itemsList = [], id = undefined) => (
  (style = {}) => {
    const {cols: COLS, [id]: idCols = undefined} = style

    const colsStyle = idCols || COLS
    const colWidths = colsStyle.map(col => col.width)
    const indexes   = colsStyle.map((_, i) => i)
    let columns     = indexes.map(() => [])

    for (let i = 0; i < itemsList.length; i++) {
      const items = itemsList[i]

      const wordsList = items.map(splitWords)

      let ks   = indexes.map(() => 0)
      let rows = indexes.map(() => '')

      while (indexes.reduce((bool, index) => bool || ks[index] < wordsList[index].length, false)) {
        const words = indexes.map(index => wordsList[index][ks[index]] || '')

        const fulls = indexes.map(index => ks[index] >= wordsList[index].length || (rows[index] + words[index]).length > colWidths[index])

        if (fulls.reduce((bool, p) => bool && p, true)) {
          columns = indexes.map(index => [...columns[index], rows[index]])
          rows    = indexes.map(index => words[index] !== ' ' ? words[index] : '')
          ks      = indexes.map(index => ks[index] + 1)
        }

        indexes.forEach(index => {
          if (!fulls[index]) {
            rows[index] = rows[index] + words[index]
            ks[index]   = ks[index] + 1
          }
        })
      }

      columns = indexes.map(index => [...columns[index], rows[index]])
    }

    return cols(columns, id)(style)
  }
)

function splitWords (string) {
  return string.split(/(\s+)/g)
}