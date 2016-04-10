'use strict';
const qs = require('querystring');
const path = require('path');

const defined = require('defined');
const xtend = require('xtend');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestGeneratorPlugin = require('webpack-bbq-manifest-generator');
const libify = require.resolve('webpack-libify');

const bbq = (config) => (client, server) => {
  client = defined(client, {});
  server = defined(server, {});

  const context = config.basedir;

  // configuration - context
  // shared
  // context 必须由 config 指定!
  if (client.context || server.context) {
    throw new Error('context SHOULD NOT BE specified');
  }
  client.context = context;
  server.context = context;

  // 主文件 (entry)
  // 应用名 (appName)
  // 通过 ${basedir}/src/ 获取主文件，index.js ？是否会有其他的可能？
  const srcpath = require.resolve(`${config.basedir}/src/`);
  let appName = path.relative(`${config.basedir}/src/`, srcpath);
  appName = path.join(path.dirname(appName), path.basename(appName, path.extname(appName)));
  const entry = { [appName]: srcpath };

  // configuration - entry
  // shared
  // entry 必须我们指定!
  if (client.entry || server.entry) {
    throw new Error('entry SHOULD NOT BE specified');
  }
  client.entry = entry;
  server.entry = entry;

  // 开发环境
  const debug = process.env.NODE_ENV === 'development';

  // configuration - debug
  // shared
  client.debug = defined(client.debug, debug);
  server.debug = defined(server.debug, debug);

  // 文件名需要有 .bundle
  // 文件名在开发环境中没有 chunkhash, contenthash, hash
  // devtool 也不一样
  let filename;
  let cssfilename;
  let bundlename;
  let devtool;
  if (debug) {
    filename = '[name].bundle.js';
    cssfilename = '[name].bundle.css';
    bundlename = '[path][name].[ext]';
    devtool = 'inline-source-map';
  } else {
    filename = '[name]-[chunkhash].bundle.js';
    cssfilename = '[name]-[contenthash].bundle.css';
    bundlename = '[path][name]-[hash].[ext]';
    devtool = 'source-map';
  }

  // configuration - devtool
  // client only
  client.devtool = defined(client.devtool, devtool);

  // plugins
  const plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new ExtractTextPlugin(cssfilename),
    new ManifestGeneratorPlugin(`${config.basedir}/app-revisions.json`),
  ];
  if (process.env.NODE_ENV === 'production') {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
  }

  // configuration - plugins
  // client only
  // 将已有的 plugins 添加到 bbq 设定的后面？
  client.plugins = plugins.concat(client.plugins).filter(v => v);

  const node = { __filename: true, __dirname: true };

  // configuration - node
  // client only
  client.node = xtend(node, client.node);

  // get loaders for specified target
  // supported targets: web, node
  const getLoaders = (target) => {
    const exposeEntryLoader = {
      test: srcpath,
      loader: `expose-loader?${appName}`,
    };

    const urlLoader = `url-loader?name=${bundlename}`;
    const svgLoader = {
      test: /\.(svg)/,
      loader: `${urlLoader}&limit=10000&mimetype=image/svg_xml`,
    };
    const fontLoader = {
      test: /\.(woff|ttf|woff2|eot)/,
      loader: urlLoader,
    };
    const imagesLoader = {
      test: /\.(png|jpg)$/,
      loader: `${urlLoader}&limit=25000`,
    };

    let babelquery = {
      'presets[]': ['react', 'es2015'],
      'plugins[]': ['transform-object-rest-spread', 'add-module-exports'],
    };
    if (target === 'node') {
      babelquery['plugins[]'].push('transform-ensure-ignore');
    }
    babelquery = qs.stringify(babelquery, null, null, {
      encodeURIComponent: (s) => (s)
    });
    const jsLoader = {
      test: /\.js$/,
      include: `${config.basedir}/src/`,
      loaders: [`babel-loader?${babelquery}`],
    };

    const csslocals =
      'css-loader/locals?modules&localIdentName=[name]__[local]___[hash:base64:5]';
    const externalCssLoader = {
      test: /\.css$/,
      include: /\/node_modules\//,
      loader: target === 'web' ?
        ExtractTextPlugin.extract('css-loader') : csslocals,
    };
    const globalCssLoader = {
      test: /\.global\.css$/,
      include: `${config.basedir}/src/`,
      loader: target === 'web' ?
        ExtractTextPlugin.extract(['css-loader']) : csslocals,
    };
    const styleLoader = {
      test: /\.css$/,
      include: `${config.basedir}/src/`,
      loaders: target === 'web' ? [
        'style-loader',
        'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]',
      ] : [csslocals],
    };

    const loaders = [
      jsLoader,
      externalCssLoader,
      globalCssLoader,
      styleLoader,
      svgLoader,
      fontLoader,
      imagesLoader,
    ];
    if (target === 'web') {
      return [
        exposeEntryLoader,
      ].concat(loaders);
    }
    return loaders;
  };

  // configuration - module
  // client only
  client.module = xtend(client.module, {
    loaders: getLoaders('web').concat(
      client.module && client.module.loaders
    ).filter(v => v),
  });

  // output
  const output = xtend(client.output, {
    filename,
    chunkFilename: filename,
    path: config.outputdir,
    publicPath: config.rootdir,
  });

  // configuration - output
  // shared partial
  client.output = output;


  // server land
  
  function ShouldNotEmit() {}
  ShouldNotEmit.prototype.apply =
    (compiler) => compiler.plugin('should-emit', () => false);

  const postLoaders = [{ loader: libify }];

  // configuration - target
  // server only
  server.target = 'node';

  // configuration - output
  // server only
  server.output = xtend(client.output, {
    path: `${config.outputdir}/SHOULD_NOT_EXISTS_DIRECTORY`,
  });

  // configuration - module
  // server only
  server.module = xtend(server.module, {
    loaders: getLoaders('node').concat(
      server.module && server.module.loaders
    ).filter(v => v),
    postLoaders,
  });

  // configuration - plugins
  server.plugins = [new ShouldNotEmit()].concat(server.plugins).filter(v => v);

  return [
    client,
    server,
  ];
};

module.exports = bbq;