import xtend from 'xtend';
import { createElement } from 'react';
import { render } from 'react-dom';
import browserHistory from 'react-router/lib/browserHistory';
import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import { routerReducer, syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import askForReduxDevTools from './askForReduxDevTools';

const App = require('./App');
const routes = require('./routes');
const reducers = require('./reducers');

export default (initialState) => {
  const rootReducer = combineReducers(xtend(reducers, {
    routing: routerReducer,
  }));
  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(thunkMiddleware, routerMiddleware(browserHistory)),
    // https://github.com/zalmoxisus/redux-devtools-extension
    // https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
    window.devToolsExtension ? window.devToolsExtension() : askForReduxDevTools
  ));
  const history = syncHistoryWithStore(browserHistory, store);
  const router = { history, routes };
  return render(
    createElement(App, { store, router }),
    document.getElementById(store.getState().appName)
  );
};
