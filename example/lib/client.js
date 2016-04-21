'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('bootstrap/dist/css/bootstrap.css');
require('./web.global.css');

var hash = require('./hash');

exports.default = function (initialState) {
  var node = hash.get(location.pathname);
  if (node.handler) {
    node.handler(initialState);
  }
};

module.exports = exports['default'];