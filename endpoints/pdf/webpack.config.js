const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: {
    pdf: path.join(__dirname, 'pdf.ts')
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
    whitelist: []
  })],
  node: {
    __dirname: false,
    __filename: false
  },
  output: {
    path: path.resolve(__dirname, '../../', 'dist/endpoints'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};
