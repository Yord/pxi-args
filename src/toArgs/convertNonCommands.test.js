const convertNonCommands = require('./convertNonCommands')

test('convertNonCommands works as expected', () => {
  const name     = {key: 'name', types: ['string'], args: ['--name'], values: ['Logan']}
  const question = {key: 'question', types: ['string'], args: ['-q'], values: ["What's your lastname?"]}
  const jokingly = {key: 'jokingly', types: [], args: ['-j'], defaultValue: [1]}
  const ask      = {key: 'ask', types: null, args: ['ask'], opts: [question, jokingly]}
  const opts     = [ask, name]

  const {errs, args} = convertNonCommands({opts})

  const expArgs = {
    _: [],
    name: 'Logan'
  }

  const expErrs = []

  expect(args).toStrictEqual(expArgs)
  expect(errs).toStrictEqual(expErrs)
})

test('convertNonCommands works if opts is undefined', () => {
  const obj = {}

  const {args} = convertNonCommands(obj)

  expect(args).toStrictEqual({_: []})
})

test('convertNonCommands works if input is undefined', () => {
  const {args} = convertNonCommands()

  expect(args).toStrictEqual({_: []})
})

test('convertNonCommands passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = convertNonCommands({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})