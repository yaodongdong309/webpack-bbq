'use strict';

var _redux = require('redux');

var identityReducer = function identityReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? 'index' : arguments[0];
  return state;
};

var errorsReducer = function errorsReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var action = arguments[1];

  if (action.error === true) {
    state.push(action.payload);
  }
  return state;
};

var fooReducer = function fooReducer() {
  var state = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
  var action = arguments[1];

  if (action.type === 'FETCH_PEANUT_FOO_SUCCESS') {
    return action.payload;
  }
  return state;
};

module.exports = {
  errors: errorsReducer,
  appName: identityReducer,
  peanut: (0, _redux.combineReducers)({
    foo: fooReducer
  })
};
