/* eslint global-require:0 */
'use strict';
const http = require('http');
const sendHtml = require('send-data/html');

const port = require('./port');
const config = require('../config');
const routerpath = require.resolve('./router');
let router = require(routerpath);

const server = http.createServer((req, res) => {
  if (process.env.NODE_ENV === 'development') {
    const route = router.hash.get(req.url);
    const clearRequireCache = require('clear-require-cache');
    if ([
      `${config.rootdir}web`,
      `${config.rootdir}web.html`,
      `${config.rootdir}web/*`,
      `${config.rootdir}m`,
      `${config.rootdir}m.html`,
      `${config.rootdir}m/*`,
      `${config.rootdir}hare`,
      `${config.rootdir}hare.html`,
      `${config.rootdir}hare/*`,
    ].indexOf(route.src) !== -1) {
      clearRequireCache(routerpath);
      router = require(routerpath);
    }
  }

  router(req, res, {}, (err) => {
    /* eslint no-param-reassign:0 */
    if (err) {
      console.error(req.url, err.stack || err.toString());
      if (res.finished) {
        return;
      }
      res.statusCode = err.statusCode || 500;
      if (process.env.NODE_ENV === 'development') {
        sendHtml(req, res, `<pre>${err.stack}</pre>`);
      } else {
        sendHtml(req, res, err.toString());
      }
    }
  });
});

module.exports = server;

if (require.main === module) {
  server.listen(port, 'localhost', function () {
    console.info(`server is listening at ${JSON.stringify(this.address())}`);
  });
}
