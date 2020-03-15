const {texts} = require('./texts')

test('texts generates expected string', () => {
  const style = {
    line: {width: 40}
  }
  
  const res = texts([
    'Deep Thought was created to come up with the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])(style)

  const txt = 'Deep Thought was created to come up with\n' +
              'the Answer.                             \n' +
              'To The Ultimate Question of Life, the   \n' +
              'Universe, and Everything.               \n'

  expect(res).toStrictEqual(txt)
})