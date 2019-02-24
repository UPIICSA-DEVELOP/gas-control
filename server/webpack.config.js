const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: {
    server: path.join(__dirname, 'index.ts')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  target: 'node',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
