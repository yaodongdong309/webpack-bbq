'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Link = require('react-router/lib/Link');

var _Link2 = _interopRequireDefault(_Link);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getHref = function getHref(pathname) {
  // /web
  var name = pathname.slice(_config.rootdir.length).split('/')[0];
  // /web.html
  name = name.split('.')[0];
  var ext = _path2.default.extname(pathname);
  return '' + _config.rootdir + name + '/peanut' + ext;
};

var WebIndexRoute = function WebIndexRoute(props) {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement(
      'p',
      null,
      _react2.default.createElement(
        'a',
        { href: 'https://github.com/wenbing/webpack-bbq' },
        'webpack-bbq'
      )
    ),
    _react2.default.createElement(
      'pre',
      null,
      'props.location: ',
      JSON.stringify(props.location, function (key, value) {
        if (key === 'key') return undefined;
        return value;
      }, 4)
    ),
    _react2.default.createElement(
      'p',
      null,
      _react2.default.createElement(
        _Link2.default,
        { to: '' + getHref(props.location.pathname) },
        'PeaNut'
      )
    ),
    props.children
  );
};

exports.default = WebIndexRoute;
module.exports = exports['default'];