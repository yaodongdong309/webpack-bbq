/* eslint global-require:0 */
'use strict';

const server = require('./server');
const port = require('./port');

if (process.env.NODE_ENV === 'production') {
  server.listen(port, function () {
    console.info(`server is listening at ${JSON.stringify(this.address())}`);
  });
} else {
  server.listen(port + 1, 'localhost', function () {
    console.info(`server is listening at ${JSON.stringify(this.address())}`);
  });

  const WebpackDevServer = require('webpack-dev-server');
  const webpack = require('webpack');

  const config = require('../config');
  const webpackConfig = require('../webpack.config');
  const statsOptions = {
    colors: { level: 1, hasBasic: true, has256: false, has16m: false },
    cached: false,
    cachedAssets: false,
    assets: true,
    modules: false,
    chunks: false,
    reasons: false,
    errorDetails: true,
    chunkOrigins: false,
    publicPath: true,
  };
  const compiler = webpack(webpackConfig[0]);
  const devServer = new WebpackDevServer(compiler, {
    contentBase: config.outputdir,
    hot: true,
    proxy: {
      '*': `http://localhost:${port + 1}`,
    },
    publicPath: config.publicPath,
    stats: statsOptions,
  });
  devServer.listen(port, 'localhost', function () {
    console.info(`webpack dev server is listening at ${JSON.stringify(this.address())}`);
  });

  const libpack = webpack(webpackConfig[1]);
  libpack.outputFileSystem = devServer.middleware.fileSystem;
  libpack.watch({}, (err, stats) => {
    if (err) console.error(err);
    else console.info(stats.toString(statsOptions));
  });
}
