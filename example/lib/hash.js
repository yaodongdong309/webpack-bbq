'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpHash = require('http-hash');

var _httpHash2 = _interopRequireDefault(_httpHash);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint global-require:0 */


var hash = (0, _httpHash2.default)();

var web = function web(initialState) {
  require('./web')(initialState);
};
hash.set(_config.rootdir + 'web/*', web);
hash.set(_config.rootdir + 'web.html', web);

var m = function m(initialState) {
  require('basscss/css/basscss.css'), require('./m')(initialState);
};
hash.set(_config.rootdir + 'm/*', m);
hash.set(_config.rootdir + 'm.html', m);

var hare = function hare(initialState) {
  require('./hare')(initialState);
};
hash.set(_config.rootdir + 'hare/*', hare);
hash.set(_config.rootdir + 'hare.html', hare);

exports.default = hash;
module.exports = exports['default'];