import { combineReducers } from 'redux';

const identityReducer = (state = 'index') => state;

const errorsReducer = (state = [], action) => {
  if (action.error === true) {
    state.push(action.payload);
  }
  return state;
};

const fooReducer = (state = null, action) => {
  if (action.type === 'FETCH_PEANUT_FOO_SUCCESS') {
    return action.payload;
  }
  return state;
};

module.exports = {
  errors: errorsReducer,
  appName: identityReducer,
  peanut: combineReducers({
    foo: fooReducer,
  }),
};
