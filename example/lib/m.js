'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _xtend = require('xtend');

var _xtend2 = _interopRequireDefault(_xtend);

var _react = require('react');

var _reactDom = require('react-dom');

var _browserHistory = require('react-router/lib/browserHistory');

var _browserHistory2 = _interopRequireDefault(_browserHistory);

var _redux = require('redux');

var _reactRouterRedux = require('react-router-redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _askForReduxDevTools = require('./askForReduxDevTools');

var _askForReduxDevTools2 = _interopRequireDefault(_askForReduxDevTools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = require('./App');
var routes = require('./routes');
var reducers = require('./reducers');

exports.default = function (initialState) {
  var rootReducer = (0, _redux.combineReducers)((0, _xtend2.default)(reducers, {
    routing: _reactRouterRedux.routerReducer
  }));
  var store = (0, _redux.createStore)(rootReducer, initialState, (0, _redux.compose)((0, _redux.applyMiddleware)(_reduxThunk2.default, (0, _reactRouterRedux.routerMiddleware)(history)),
  // https://github.com/zalmoxisus/redux-devtools-extension
  // https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
  window.devToolsExtension ? window.devToolsExtension() : _askForReduxDevTools2.default));
  var history = (0, _reactRouterRedux.syncHistoryWithStore)(_browserHistory2.default, store);
  var router = { history: history, routes: routes };
  return (0, _reactDom.render)((0, _react.createElement)(App, { store: store, router: router }), document.getElementById(store.getState().appName));
};

module.exports = exports['default'];
