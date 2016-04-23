/* eslint global-require:0 */
import WebIndexRoute from './WebIndexRoute';
import WebContainer from './WebContainer';
import { rootdir } from '../config';

const routes = [{
  path: `${rootdir}web.html`,
  indexRoute: { component: WebIndexRoute },
  component: WebContainer,
}, {
  path: `${rootdir}web`,
  indexRoute: { component: WebIndexRoute },
  component: WebContainer,
  getChildRoutes: (location, callback) => {
    require.ensure([], () => callback(null, require('./peanut.routes')), 'peanut');
  },
}, {
  path: `${rootdir}m.html`,
  component: WebContainer,
  indexRoute: { component: WebIndexRoute },
}, {
  path: `${rootdir}m`,
  component: WebContainer,
  indexRoute: { component: WebIndexRoute },
  getChildRoutes: (location, callback) => {
    require.ensure([], () => callback(null, require('./peanut.routes')), 'peanut');
  },
}, {
  path: `${rootdir}hare.html`,
  component: WebContainer,
  indexRoute: { component: WebIndexRoute },
}, {
  path: `${rootdir}hare`,
  component: WebContainer,
  indexRoute: { component: WebIndexRoute },
  getChildRoutes: (location, callback) => {
    require.ensure([], () => callback(null, require('./peanut.routes')), 'peanut');
  },
}];

module.exports = routes;
