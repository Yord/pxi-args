const setDefaultValues = require('./setDefaultValues')
const {number} = require('../../options')

const noArgs = ({args, ...rest}) => rest

test('setDefaultValues works as expected', () => {
  const answer = number('answer', ['-a', '--answer'], {values: [42]})

  const opts = [answer]

  const {opts: opts2} = setDefaultValues(opts)({})

  const exp = opts.map(noArgs)

  expect(opts2).toStrictEqual(exp)
})

test('setDefaultValues does not set default values if the option is present', () => {
  const answer42 = number('answer', ['-a', '--answer'], {values: [42]})
  const answer23 = number('answer', ['-a', '--answer'], {values: [23]})

  const opts = [answer42]

  const {opts: opts2} = setDefaultValues(opts)({
    opts: [answer23]
  })

  const exp = [answer23]

  expect(opts2).toStrictEqual(exp)
})