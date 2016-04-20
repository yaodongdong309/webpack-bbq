if (process.env.NODE_ENV === undefined) {
  process.env.NODE_ENV = 'development';
}
const basedir = __dirname;

module.exports = {
  basedir: basedir,
  outputdir: basedir + '/public',
  rootdir: '/',
};
