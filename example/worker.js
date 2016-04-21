if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = 'development';
}
const rimraf = require('rimraf');

const config = require('./config');
rimraf.sync(`${config.basedir}/lib/`);

require('./server/');
