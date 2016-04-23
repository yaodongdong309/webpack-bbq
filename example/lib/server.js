'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _match = require('react-router/lib/match');

var _match2 = _interopRequireDefault(_match);

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _xhrRequest = require('xhr-request');

var _xhrRequest2 = _interopRequireDefault(_xhrRequest);

var _mapAsync = require('map-async');

var _mapAsync2 = _interopRequireDefault(_mapAsync);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _getChunkNames = require('./getChunkNames');

var _getChunkNames2 = _interopRequireDefault(_getChunkNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootReducer = (0, _redux.combineReducers)(_reducers2.default);
var storeEnhancer = (0, _redux.applyMiddleware)(_reduxThunk2.default);
var appName = expose(require.resolve('../src/client'), _config2.default.basedir + '/src/');
var revisions = null; // lazy

exports.default = function (location, callback) {
  var initialState = { appName: appName };
  var store = (0, _redux.createStore)(rootReducer, initialState, storeEnhancer);

  (0, _match2.default)({ location: location, routes: _routes2.default }, function (err, redirectLocation, renderProps) {
    if (err) {
      return callback(err);
    }
    if (redirectLocation) {
      return callback(new Error('redirectLocation: ' + redirectLocation));
    }
    if (!renderProps) {
      var rerr = new Error('match({ location: ' + location + ' }): renderProps is missing');
      rerr.statusCode = 404;
      return callback(rerr);
    }

    // StaticRendering
    if (_path2.default.extname(location) === '.html') {
      return callback(null, renderToString(store, renderProps));
    }

    var components = renderProps.components.filter(function (component) {
      return typeof component.getInitialData === 'function';
    });
    (0, _mapAsync2.default)(components, function (component, cb) {
      var request = createRequest(component);
      component.getInitialData({
        request: request,
        dispatch: store.dispatch
      }, cb);
    }, function (err) {
      callback(null, renderToString(store, renderProps));
    });
  });
};

function createRequest(component) {
  var host = 'http://localhost:8080';
  return function (api, opts, cb) {
    return (0, _xhrRequest2.default)('' + host + api, opts, cb);
  };
}

function renderToString(store, router) {
  if (revisions === null) {
    revisions = require('../app-revisions.json');
  }

  var el = (0, _react.createElement)(_App2.default, { store: store, router: router });
  var appHtml = _server2.default.renderToString(el);

  var chunkNames = (0, _getChunkNames2.default)(router.location);
  var stylesheets = ['<link href="' + _config2.default.publicPath + revisions[appName + '.css'] + '" rel="stylesheet" />'];
  var javascripts = ['<script src="' + _config2.default.publicPath + revisions[appName + '.js'] + '"></script>'].concat(chunkNames.map(function (chunkName) {
    return '<script src="' + _config2.default.publicPath + revisions[chunkName + '.js'] + '"></script>';
  })).concat(['<script>window[' + JSON.stringify(appName) + '](' + JSON.stringify(store.getState()) + ');</script>']);
  if (process.env.NODE_ENV === 'development') {
    javascripts.push('<script src="/webpack-dev-server.js"></script>');
  }

  var html = '<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <title>webpack-bbq</title>\n    ' + stylesheets.join('\n    ') + '\n  </head>\n  <body>\n    <div id="' + appName + '">' + appHtml + '</div>\n    ' + javascripts.join('\n    ') + '\n  </body>\n</html>\n  ';
  return html;
}

function expose(filename, basedir) {
  var extname = _path2.default.extname(filename);
  var relname = _path2.default.relative(basedir, filename);
  return _path2.default.join(_path2.default.dirname(relname), _path2.default.basename(relname, extname));
}
module.exports = exports['default'];
