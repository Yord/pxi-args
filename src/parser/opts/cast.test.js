const cast = require('./cast')
const {argumentIsNotABool, argumentIsNotANumber} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('cast casts values into their types', () => {
  const obj = {
    opts: [
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']},
      {...number('answer', ['-a', '--answer']), values: ['42']},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: ['false']},
      {...flag('version', ['--version']), values: []}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
    {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
    {...number('answer', ['-a', '--answer']), values: [42]},
    {...command('help', ['-h', '--help']), values: ['foo --bar']},
    {...bool('verbose', ['--verbose']), values: [false]},
    {...flag('version', ['--version']), values: [true]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast does not cast strings', () => {
  const obj = {
    opts: [
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]}
  ]

  expect(opts).toStrictEqual(exp)
})