import path from 'path';
import { createElement } from 'react';
import ReactDOMServer from 'react-dom/server';
import match from 'react-router/lib/match';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import request from 'xhr-request';
import map from 'map-async';

import config from '../config';
import App from './App';
import routes from './routes';
import reducers from './reducers';
import getChunkNames from './getChunkNames';

const rootReducer = combineReducers(reducers);
const storeEnhancer = applyMiddleware(thunkMiddleware);
const appName = expose(require.resolve('../src/client'), `${config.basedir}/src/`);
let revisions = null; // lazy

export default (location, callback) => {
  const initialState = { appName };
  const store = createStore(rootReducer, initialState, storeEnhancer);

  match({ location, routes }, (err, redirectLocation, renderProps) => {
    if (err) {
      return callback(err);
    }
    if (redirectLocation) {
      return callback(new Error(`redirectLocation: ${redirectLocation}`));
    }
    if (!renderProps) {
      const rerr = new Error(`match({ location: ${location} }): renderProps is missing`);
      rerr.statusCode = 404;
      return callback(rerr);
    }

    // StaticRendering
    if (path.extname(location) === '.html') {
      return callback(null, renderToString(store, renderProps));
    }

    const components = renderProps.components
    .filter(component => (typeof component.getInitialData === 'function'));
    map(components, (component, cb) => {
      const request = createRequest(component);
      component.getInitialData({
        request,
        dispatch: store.dispatch
      }, cb);
    }, (err) => {
      callback(null, renderToString(store, renderProps));
    });
  });
};

function createRequest(component) {
  const host = `http://localhost:8080`;
  return (api, opts, cb) => request(`${host}${api}`, opts, cb);
}

function renderToString(store, router) {
  if (revisions === null) {
    revisions = require('../app-revisions.json');
  }

  const el = createElement(App, { store, router });
  const appHtml = ReactDOMServer.renderToString(el);

  const chunkNames = getChunkNames(router.location);
  const stylesheets = [
    `<link href="${config.publicPath}${revisions[`${appName}.css`]}" rel="stylesheet" />`,
  ];
  const javascripts = [
    `<script src="${config.publicPath}${revisions[`${appName}.js`]}"></script>`,
  ]
  .concat(chunkNames.map((chunkName) => (
    `<script src="${config.publicPath}${revisions[`${chunkName}.js`]}"></script>`
  )))
  .concat([
    `<script>window[${JSON.stringify(appName)}](${JSON.stringify(store.getState())});</script>`,
  ]);
  if (process.env.NODE_ENV === 'development') {
    javascripts.push(`<script src="/webpack-dev-server.js"></script>`);
  }

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>webpack-bbq</title>
    ${stylesheets.join('\n    ')}
  </head>
  <body>
    <div id="${appName}">${appHtml}</div>
    ${javascripts.join('\n    ')}
  </body>
</html>
  `;
  return html;
}

function expose(filename, basedir) {
  const extname = path.extname(filename);
  const relname = path.relative(basedir, filename);
  return path.join(path.dirname(relname), path.basename(relname, extname));
}
