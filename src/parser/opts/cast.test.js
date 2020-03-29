const cast = require('./cast')
const {argumentIsNotABool, argumentIsNotANumber} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('cast README example works', () => {
  const obj = {
    opts: [
      {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']},
      {...number('answer', ['-a', '--answer']), values: ['42']},
      {...command('help', ['-h', '--help']), values: ['foo --bar']},
      {...bool('verbose', ['--verbose']), values: ['false']},
      {...flag('version', ['--version']), values: [1]}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...string('title', ['--title']), values: ["The Hitchhiker's Guide to the Galaxy"]},
    {...numberBool('numBool', ['-n', '--nb']), values: [23, true]},
    {...number('answer', ['-a', '--answer']), values: [42]},
    {...command('help', ['-h', '--help']), values: ['foo --bar']},
    {...bool('verbose', ['--verbose']), values: [false]},
    {...flag('version', ['--version']), values: [1]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast does not cast strings in values', () => {
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

test('cast does not cast strings in defaultValues', () => {
  const obj = {
    opts: [
      string('title', ['--title'], {defaultValues: ["The Hitchhiker's Guide to the Galaxy"]})
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    string('title', ['--title'], {defaultValues: ["The Hitchhiker's Guide to the Galaxy"]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts numbers in values', () => {
  const obj = {
    opts: [
      {...number('answer', ['-a', '--answer']), values: ['42']}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...number('answer', ['-a', '--answer']), values: [42]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts numbers in defaultValues', () => {
  const obj = {
    opts: [
      number('answer', ['-a', '--answer'], {defaultValues: ['42']})
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    number('answer', ['-a', '--answer'], {defaultValues: [42]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts numbers twice in values', () => {
  const obj = {
    opts: [
      {...number('answer', ['-a', '--answer']), values: ['42']}
    ]
  }

  const {opts} = cast(cast(obj))

  const exp = [
    {...number('answer', ['-a', '--answer']), values: [42]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts numbers twice in defaultValues', () => {
  const obj = {
    opts: [
      number('answer', ['-a', '--answer'], {defaultValues: ['42']})
    ]
  }

  const {opts} = cast(cast(obj))

  const exp = [
    number('answer', ['-a', '--answer'], {defaultValues: [42]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast does not change commands in values', () => {
  const obj = {
    opts: [
      {...command('help', ['-h', '--help']), values: ['foo --bar']}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...command('help', ['-h', '--help']), values: ['foo --bar']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast does not change commands in defaultValues', () => {
  const obj = {
    opts: [
      command('help', ['-h', '--help'], {defaultValues: ['foo --bar']})
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    command('help', ['-h', '--help'], {defaultValues: ['foo --bar']})
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts bools in values', () => {
  const obj = {
    opts: [
      {...bool('verbose', ['--verbose']), values: ['false']}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...bool('verbose', ['--verbose']), values: [false]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts bools in defaultValues', () => {
  const obj = {
    opts: [
      bool('verbose', ['--verbose'], {defaultValues: ['false']})
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    bool('verbose', ['--verbose'], {defaultValues: [false]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts bools twice in values', () => {
  const obj = {
    opts: [
      {...bool('verbose', ['--verbose']), values: ['false']}
    ]
  }

  const {opts} = cast(cast(obj))

  const exp = [
    {...bool('verbose', ['--verbose']), values: [false]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts bools twice in defaultValues', () => {
  const obj = {
    opts: [
      bool('verbose', ['--verbose'], {defaultValues: ['false']})
    ]
  }

  const {opts} = cast(cast(obj))

  const exp = [
    bool('verbose', ['--verbose'], {defaultValues: [false]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast does not change flags in values', () => {
  const version = {...flag('version', ['--version']), values: [1]}

  const obj = {
    opts: [version]
  }

  const {opts} = cast(obj)

  const exp = [version]

  expect(opts).toStrictEqual(exp)
})

test('cast does not change flags in defaultValues', () => {
  const version = flag('version', ['--version'], {defaultValues: [1]})

  const obj = {
    opts: [version]
  }

  const {opts} = cast(obj)

  const exp = [version]

  expect(opts).toStrictEqual(exp)
})

test('cast casts arrays in values', () => {
  const obj = {
    opts: [
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']}
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    {...numberBool('numBool', ['-n', '--nb']), values: [23, true]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts arrays in defaultValues', () => {
  const obj = {
    opts: [
      numberBool('numBool', ['-n', '--nb'], {defaultValues: ['23', 'true']})
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    numberBool('numBool', ['-n', '--nb'], {defaultValues: [23, true]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts arrays twice in values', () => {
  const obj = {
    opts: [
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']}
    ]
  }

  const {opts} = cast(cast(obj))

  const exp = [
    {...numberBool('numBool', ['-n', '--nb']), values: [23, true]}
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast casts arrays twice in defaultValues', () => {
  const obj = {
    opts: [
      numberBool('numBool', ['-n', '--nb'], {defaultValues: ['23', 'true']})
    ]
  }

  const {opts} = cast(cast(obj))

  const exp = [
    numberBool('numBool', ['-n', '--nb'], {defaultValues: [23, true]})
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast reports an error on wrong bools in values', () => {
  const option = {...bool('verbose', ['--verbose']), values: ['foo']}

  const obj = {opts: [option]}

  const {errs} = cast(obj)

  const exp = [
    argumentIsNotABool({values: option.values, index: 0, option})
  ]

  expect(errs).toStrictEqual(exp)
})

test('cast reports an error on wrong bools in defaultValues', () => {
  const option = bool('verbose', ['--verbose'], {defaultValues: ['foo']})

  const obj = {opts: [option]}

  const {errs} = cast(obj)

  const exp = [
    argumentIsNotABool({defaultValues: option.defaultValues, index: 0, option})
  ]

  expect(errs).toStrictEqual(exp)
})

test('cast reports an error on wrong numbers in values', () => {
  const option = {...number('answer', ['-a', '--answer']), values: ['fourtytwo']}

  const obj = {opts: [option]}

  const {errs} = cast(obj)

  const exp = [
    argumentIsNotANumber({values: option.values, index: 0, option})
  ]

  expect(errs).toStrictEqual(exp)
})

test('cast reports an error on wrong numbers in defaultValues', () => {
  const option = number('answer', ['-a', '--answer'], {defaultValues: ['fourtytwo']})

  const obj = {opts: [option]}

  const {errs} = cast(obj)

  const exp = [
    argumentIsNotANumber({defaultValues: option.defaultValues, index: 0, option})
  ]

  expect(errs).toStrictEqual(exp)
})

test('cast ignores all options with types it does not know', () => {
  const option = {key: 'foo', types: ['foo'], args: ['-a', '--answer'], values: ['42'], defaultValues: ['42']}

  const obj = {opts: [option]}

  const {opts} = cast(obj)

  const exp = obj.opts

  expect(opts).toStrictEqual(exp)
})

test('cast works if values is undefined', () => {
  const obj = {
    opts: [
      number('answer', ['-a', '--answer'])
    ]
  }

  const {opts} = cast(obj)

  const exp = [
    number('answer', ['-a', '--answer'])
  ]

  expect(opts).toStrictEqual(exp)
})

test('cast works if values is null', () => {
  const answer = {...number('answer', ['-a', '--answer']), values: null}

  const obj = {
    opts: [answer]
  }

  const {opts} = cast(obj)

  const exp = [answer]

  expect(opts).toStrictEqual(exp)
})

test('cast works if opts is undefined', () => {
  const obj = {}

  const {opts} = cast(obj)

  expect(opts).toStrictEqual([])
})

test('cast works if input is undefined', () => {
  const {opts} = cast()

  expect(opts).toStrictEqual([])
})

test('cast passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = cast({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})