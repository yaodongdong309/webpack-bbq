'use strict';

var _WebIndexRoute = require('./WebIndexRoute');

var _WebIndexRoute2 = _interopRequireDefault(_WebIndexRoute);

var _WebContainer = require('./WebContainer');

var _WebContainer2 = _interopRequireDefault(_WebContainer);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = [{
  path: _config.rootdir + 'web.html',
  indexRoute: { component: _WebIndexRoute2.default },
  component: _WebContainer2.default
}, {
  path: _config.rootdir + 'web',
  indexRoute: { component: _WebIndexRoute2.default },
  component: _WebContainer2.default,
  getChildRoutes: function getChildRoutes(location, callback) {
    callback(null, require('./peanut.routes'));
  }
}, {
  path: _config.rootdir + 'm.html',
  component: _WebContainer2.default,
  indexRoute: { component: _WebIndexRoute2.default }
}, {
  path: _config.rootdir + 'm',
  component: _WebContainer2.default,
  indexRoute: { component: _WebIndexRoute2.default },
  getChildRoutes: function getChildRoutes(location, callback) {
    callback(null, require('./peanut.routes'));
  }
}, {
  path: _config.rootdir + 'hare.html',
  component: _WebContainer2.default,
  indexRoute: { component: _WebIndexRoute2.default }
}, {
  path: _config.rootdir + 'hare',
  component: _WebContainer2.default,
  indexRoute: { component: _WebIndexRoute2.default },
  getChildRoutes: function getChildRoutes(location, callback) {
    callback(null, require('./peanut.routes'));
  }
}]; /* eslint global-require:0 */


module.exports = routes;