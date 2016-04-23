/* eslint global-require:0 */
require('bootstrap/dist/css/bootstrap.css');
require('./web.global.css');

if (process.env.NODE_ENV === 'development') {
  require('webpack-dev-server/client');
}
const hash = require('./hash');

export default (initialState) => {
  const node = hash.get(location.pathname);
  if (node.handler) {
    node.handler(initialState);
  }
};
