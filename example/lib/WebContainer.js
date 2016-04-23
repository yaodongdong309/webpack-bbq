'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _index = require('./index.css');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebContaner = function WebContaner(props) {
  return _react2.default.createElement(
    'div',
    { className: _index2.default.js },
    _react2.default.createElement(
      'div',
      { className: _index2.default.css },
      'Web Contaner'
    ),
    props.children
  );
};

WebContaner.propTypes = {
  children: _react.PropTypes.element
};

exports.default = WebContaner;
module.exports = exports['default'];