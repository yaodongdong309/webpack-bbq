const httpHashRouter = require('http-hash-router');
const httpHashMocker = require('http-hash-mocker');
const st = require('st');

const config = require('../config');
const web = require('./web');

const router = httpHashRouter();
router.set('/api/*', httpHashMocker([
], { basedir: config.basedir }));
router.set(`${config.rootdir}web`, web);
router.set(`${config.rootdir}web/*`, web);
router.set(`${config.rootdir}m`, web);
router.set(`${config.rootdir}m/*`, web);
router.set(`${config.rootdir}hare`, web);
router.set(`${config.rootdir}hare/*`, web);
router.set(`${config.rootdir}*`, st({
  path: config.outputdir,
  url: config.rootdir,
  cache: process.env.NODE_ENV === 'production',
}));

module.exports = router;
