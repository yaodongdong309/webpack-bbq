/* eslint no-use-before-define:0 */
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
import port from '../server/port';

const rootReducer = combineReducers(reducers);
const storeEnhancer = applyMiddleware(thunkMiddleware);
const appName = expose(require.resolve('../src/client'), `${config.basedir}/src/`);
let revisions = null; // lazy

export default (location, callback) => {
  const initialState = { appName };
  const store = createStore(rootReducer, initialState, storeEnhancer);

  match({ location, routes }, (err, redirectLocation, renderProps) => {
    if (err) {
      callback(err);
      return;
    }
    if (redirectLocation) {
      callback(new Error(`redirectLocation: ${redirectLocation}`));
      return;
    }
    if (!renderProps) {
      const rerr = new Error(`match({ location: ${location} }): renderProps is missing`);
      rerr.statusCode = 404;
      callback(rerr);
      return;
    }

    // StaticRendering
    if (path.extname(location) === '.html') {
      callback(null, renderToString(store, renderProps));
      return;
    }

    const components = renderProps.components
    .filter(component => (typeof component.getInitialData === 'function'));
    map(components, (component, cb) => {
      const injectedRequest = createRequest(component);
      component.getInitialData({
        request: injectedRequest,
        dispatch: store.dispatch,
      }, (loadErr) => {
        /* eslint no-param-reassign:0 */
        if (loadErr) {
          loadErr.component = component;
        }
        cb(loadErr);
      });
    }, (mapLoadErr) => {
      callback(mapLoadErr, renderToString(store, renderProps));
    });
  });
};

function createRequest() {
  const host = `http://localhost:${port}`;
  return (api, opts, cb) => request(`${host}${api}`, opts, cb);
}

function renderToString(store, router) {
  /* eslint global-require:0 */
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
