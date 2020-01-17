const {anything, array, assert, base64, property} = require('fast-check')
const option = require('./option')

test('option transforms options DSL into arguments DSL', () => {
  const optionsArguments = base64().chain(arg =>
    array(base64(), 1, 20).chain(args =>
      anything().chain(types =>
        anything().chain(only =>
          anything().chain(desc =>
            anything().map(opts => {
              const options = {
                arg,
                types: typeof types !== 'undefined' ? types : null,
                only:  typeof only  !== 'undefined' ? only  : null,
                desc:  typeof desc  !== 'undefined' ? desc  : '',
                opts:  typeof opts  !== 'undefined' ? opts  : null
              }
              return {
                options: {...options, args},
                _arguments: {
                  errs: [],
                  args: args.reduce((obj, key) => ({...obj, [key]: options}), {})
                }
              }
            })
          )
        )
      )
    )
  )

  assert(
    property(optionsArguments, ({options, _arguments}) => {
      expect(
        option(options)
      ).toStrictEqual(
        _arguments
      )
    })
  )
})