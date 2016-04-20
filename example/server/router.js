const httpHashRouter = require('http-hash-router');
const httpHashMocker = require('http-hash-mocker');
const st = require('st')

const config = require('../config');
const web = require('./web');

const mocker = httpHashMocker([
], { basedir: config.basedir });

const router = httpHashRouter();
router.set('/api/*', mocker);
router.set('/web', web);
router.set('/web/*', web);
router.set('/m', web);
router.set('/m/*', web);
router.set('/hare', web);
router.set('/hare/*', web);
router.set(`${config.rootdir}*`, st({
  path: config.outputdir,
  url: config.rootdir,
  cache: false,
}));

module.exports = router;
