require('bootstrap/dist/css/bootstrap.css');
require('./web.global.css');

const hash = require('./hash');

export default (initialState) => {
  const node = hash.get(location.pathname);
  if (node.handler) {
    node.handler(initialState);
  }
};
