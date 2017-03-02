require('babel-polyfill')
require('babel-register')({
  'presets': [
    'babel-preset-react',
    'babel-preset-es2015',
    'babel-preset-stage-0',
  ].map(require.resolve),
})

require('./server')
