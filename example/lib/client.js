'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint global-require:0 */
require('bootstrap/dist/css/bootstrap.css');
require('./web.global.css');

if (process.env.NODE_ENV === 'development') {
  require('webpack-dev-server/client');
}
var hash = require('./hash');

exports.default = function (initialState) {
  var node = hash.get(location.pathname);
  if (node.handler) {
    node.handler(initialState);
  }
};

module.exports = exports['default'];