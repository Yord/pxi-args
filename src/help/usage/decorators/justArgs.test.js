const justArgs = require('./justArgs')
const {command, flag, number} = require('../../../options')
const {optsList} = require('../optsList')

const id = opts => opts

test('justArgs README example works', () => {
  const style = {
    cols: [{width: 18, padEnd: 2}, {width: 20}]
  }
  
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const res = justArgs(['-a', '-h'])(optsList)(opts)(style)

  const exp = '-a,                 The answer.         \n' +
              '--answer=<number>                       \n' +
              '-h, --help          Prints help.        \n'

  expect(res).toStrictEqual(exp)
})

test('justArgs filters more than one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs(['-a', '-h'])(id)(opts)

  expect(res).toStrictEqual(opts.slice(0, 2))
})

test('justArgs filters exactly one opt', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs(['--version'])(id)(opts)

  expect(res).toStrictEqual(opts.slice(2, 3))
})

test('justArgs filters all opts', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs(['-a', '-h', '--version'])(id)(opts)

  expect(res).toStrictEqual(opts)
})

test('justArgs filters no opt if no opt has elements', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs(['--foo'])(id)(opts)

  expect(res).toStrictEqual([])
})

test('justArgs filters no opt if list is empty', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs([])(id)(opts)

  expect(res).toStrictEqual([])
})

test('justArgs filters no opt if list is undefined', () => {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    command('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]

  const res = justArgs()(id)(opts)

  expect(res).toStrictEqual([])
})

test('justArgs returns an empty list if opts are empty', () => {
  const opts = []

  const res = justArgs(['-h'])(id)(opts)

  expect(res).toStrictEqual([])
})

test('justArgs returns an empty list if opts are undefined', () => {
  const res = justArgs(['-h'])(id)()

  expect(res).toStrictEqual([])
})