const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const FileManagerPlugin = require('filemanager-webpack-plugin');
module.exports = {
  entry: {
    server: path.join(__dirname, 'server.ts'),
    logger: path.join(__dirname, 'logger/logger.ts')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  target: 'node',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'PORT': JSON.stringify(process.env.PORT)
      }
    }),
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: path.resolve(__dirname, '../', '.well-known/apple-app-site-association'), destination: path.resolve(__dirname, '../', 'dist/.well-known') },
          { source: path.resolve(__dirname, '../', `.well-known/assetlinks-${process.env.NODE_ENV || 'dev'}.json`), destination: path.resolve(__dirname, '../', 'dist/.well-known/assetlinks.json') }
        ]
      }
    })
  ],
  externals: [nodeExternals({
    whitelist: [
      /^@agm\/core/,
      /^hammerjs/,
      /^@ngx-translate\/core/,
      /^@angular\/fire/,
      /^chartjs/
    ]
  })],
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    path: path.resolve(__dirname, '../', 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};
