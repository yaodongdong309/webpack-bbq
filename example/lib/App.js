'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _Router = require('react-router/lib/Router');

var _Router2 = _interopRequireDefault(_Router);

var _RouterContext = require('react-router/lib/RouterContext');

var _RouterContext2 = _interopRequireDefault(_RouterContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isServer = typeof window === 'undefined';
var RouterContainer = isServer ? _RouterContext2.default : _Router2.default;

var App = function App(props) {
  return _react2.default.createElement(
    _reactRedux.Provider,
    { store: props.store },
    _react2.default.createElement(RouterContainer, props.router)
  );
};

App.propTypes = {
  router: _react.PropTypes.object.isRequired,
  store: _react.PropTypes.object.isRequired
};

exports.default = App;
module.exports = exports['default'];