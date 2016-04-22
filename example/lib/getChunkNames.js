'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var hash = require('./hash');

var _require = require('../config');

var rootdir = _require.rootdir;


var getChunkNames = function getChunkNames(location) {
  var route = hash.get(location.pathname);
  var chunkNames = [];
  if (route.src === rootdir + '/web/*' || route.src === rootdir + 'web.html') {
    chunkNames.push('web');
  }
  if (route.src === rootdir + '/m/*' || route.src === rootdir + 'm.html') {
    chunkNames.push('m');
  }
  if (route.src === rootdir + '/hare/*' || route.src === rootdir + 'hare.html') {
    chunkNames.push('hare');
  }
  var peanut = location.pathname.slice(rootdir.length).split('/')[1];
  if (peanut === 'peanut' || peanut === 'peanut.html') {
    chunkNames.push('peanut');
  }
  return chunkNames;
};

exports.default = getChunkNames;
module.exports = exports['default'];