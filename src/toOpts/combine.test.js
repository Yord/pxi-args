const {anything, array, assert, base64, constant, integer, oneof, property} = require('fast-check')
const {invalidTypes, nonMatchingArgumentTypes, invalidOptionsListInCombine} = require('../errors')
const {combine} = require('./combine')

test('combine combines all options and appends options if they have the same argument', () => {
  const optionsCombined = array(option(), 2, 20).map(opts => {
    const combined = opts.reduce(
      (acc, {args}) => Object.keys(args).reduce(
        (acc2, key) => ({
          errs: [],
          args: {
            ...acc2.args,
            [key]: (
              acc2.args[key] ? [...acc2.args[key], ...args[key].map(arg => ({...arg, types: acc2.args[key][0].types}))]
                             : args[key]
            )
          }
        }),
        acc
      ),
      {errs: [], args: {}}
    )
    const options = Object.keys(combined.args).reduce(
      (acc, arg) => [
        ...acc,
        ...combined.args[arg].map(obj => ({
          errs: [],
          args: {[arg]: [obj]}
        }))
      ],
      []
    )
    return {combined, options}
  })

  assert(
    property(optionsCombined, ({options, combined}) =>
      expect(
        combine(...options)
      ).toStrictEqual(
        combined
      )
    )
  )
})

test("combine fails with an error if an argument's list is null, undefined or empty", () => {
  const optionResult = integer(1, 20).chain(len =>
    array(
      oneof(...[null, undefined, []].map(constant)).chain(options =>
        base64().chain(arg =>
          option(arg, true, options).map(argument => ({argument, arg, options}))
        )
      ),
      1,
      len
    ).map(options =>
      ({
        arguments: options.map(info => info.argument),
        results: {
          args: {},
          errs: options.map(invalidOptionsListInCombine)
        }
      })
    )
  )

  assert(
    property(optionResult, ({arguments: args, results}) =>
      expect(
        combine(...args)
      ).toStrictEqual(
        results
      )
    )
  )
})

test("combine fails with an error if an argument has a types key that is not an array", () => {
  const optionResult = (
    array(
      anything()
      .filter(a => typeof a !== 'undefined' && !Array.isArray(a))
      .chain(types =>
        option(undefined, false, undefined, true, types)
        .map(option => ({option, types}))
      ),
      1,
      10
    )
    .map(os =>
      ({
        options: os.map(o => o.option),
        result: {
          args: {},
          errs: os.map(o =>
            invalidTypes({types: o.types, option: Object.values(o.option.args)[0][0]})
          )
        }
      })
    )
  )

  assert(
    property(optionResult, ({options, result}) =>
      expect(
        combine(...options)
      ).toStrictEqual(
        result
      )
    )
  )
})

test("combine passes on errors", () => {
  const optionsResult = (
    array(
      array(anything(), 1, 5).map(a => ({args: {}, errs: a})),
      1,
      10
    )
    .map(options => ({
      options,
      result: options.reduce(
        ({args, errs}, option) => ({args, errs: [...errs, ...option.errs]}),
        {args: {}, errs: []}
      )
    }))
  )

  assert(
    property(optionsResult, ({options, result}) =>
      expect(
        combine(...options)
      ).toStrictEqual(
        result
      )
    )
  )
})

test('combine fails with an error if two options with different types lengths are grouped in the same argument', () => {
  const optionA = {key: 'A', args: ['-a'], types: ['string']}
  const optionB = {key: 'B', args: ['-a'], types: ['string', 'number']}

  const opts = [
    optionA,
    optionB
  ]

  const {errs, args} = combine(...opts.map(require('./option').option))

  const exp = [
    nonMatchingArgumentTypes({arg: '-a', ref: optionA, option: optionB})
  ]

  expect(errs).toStrictEqual(exp)

  expect(args).toStrictEqual({
    '-a': [optionA]
  })
})

test('combine fails with an error if two options are grouped in the same argument and the second does not have a valid type', () => {
  const optionA = {key: 'A', args: ['-a'], types: ['string']}
  const optionB = {key: 'B', args: ['-a'], types: 42}

  const opts = [
    optionA,
    optionB
  ]

  const {errs, args} = combine(...opts.map(require('./option').option))

  const exp = [
    invalidTypes({types: 42, option: optionB})
  ]

  expect(errs).toStrictEqual(exp)

  expect(args).toStrictEqual({
    '-a': [optionA]
  })
})

test('combine works if opts are empty', () => {
  const opts = []

  const {args} = combine(...opts.map(require('./option').option))

  expect(args).toStrictEqual({})
})

test('combine works if opts are undefined', () => {
  const {args} = combine()

  expect(args).toStrictEqual({})
})

test('combine works if args are empty', () => {
  const {args} = combine({})

  expect(args).toStrictEqual({})
})

test('combine also takes several options at the same time', () => {
  const optionA = {key: 'A', args: ['-a'], types: ['string']}
  const optionB = {key: 'B', args: ['-a'], types: ['number']}

  const {args} = combine({
    args: {'-a': [optionA, optionB]}
  })

  expect(args).toStrictEqual({
    '-a': [optionA, optionB]
  })
})

function option (_arg, hasArguments, _arguments, hasTypes, _types) {
  return base64().chain(arg =>
    base64().chain(key =>
      oneof(constant(undefined), types()).map(types =>
        ({
          errs: [],
          args: {
            [_arg || arg]: hasArguments ? _arguments : [{key, types: hasTypes ? _types : types}]
          }
        })
      )
    )
  )
}

function types () {
  const oneElem = ['string', 'number', 'bool']
  const arr = array(oneof(...oneElem.map(constant)), 2, 10)
  return oneof(...[...oneElem.map(a => [a]), []].map(constant), arr)
}