'use strict';
const sendHtml = require('send-data/html');

let app = null; // lazy

module.exports = (req, res, opts, cb) => {
  if (app === null) {
    app = require('../lib/server');
  }
  app(req.url, (err, html) => {
    if (err) {
      return cb(err);
    }
    sendHtml(req, res, html, cb);
  });
};
