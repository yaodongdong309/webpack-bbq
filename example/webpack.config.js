const path = require('path');

const config = require('./config');

module.exports = require('../')(config)({
  entry: require.resolve('./src/client'),
  postcss: () => [require('postcss-nesting')],
}, {
  entry: require.resolve('./src/server'),
  staticRendering: [
    `${config.rootdir}web.html`,
    `${config.rootdir}m.html`,
    `${config.rootdir}hare.html`,
    `${config.rootdir}web/peanut.html`,
    `${config.rootdir}m/peanut.html`,
    `${config.rootdir}hare/peanut.html`,
  ],
});
