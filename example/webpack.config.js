const path = require('path');

const config = require('./config');

module.exports = require('../')({
  basedir: config.basedir,
  outputdir: config.outputdir,
  publicPath: config.rootdir,
})({
  entry: { client: './src/client' },
  postcss: () => [require('postcss-nesting')],
}, {
  entry: './src/server',
  staticRendering: [
    '/web.html',
    '/m.html',
    '/hare.html',
    '/web/peanut.html',
    '/m/peanut.html',
    '/hare/peanut.html',
  ],
});
