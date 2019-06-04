const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const FileManagerPlugin = require('filemanager-webpack-plugin');
module.exports = {
  entry: {
    ['pdf-sasisopa']: path.join(__dirname, 'pdf', 'pdf-sasisopa.ts'),
    ['pdf-sgm']: path.join(__dirname, 'pdf', 'pdf-sgm.ts'),
    ['join-pdf']: path.join(__dirname, 'pdf', 'join-pdf.ts'),
    ['pdf']: path.join(__dirname, 'pdf', 'pdf.ts'),
    ['commons']: path.join(__dirname, 'pdf', 'commons.ts'),
    ['bc']: path.join(__dirname, 'bc.ts'),
    ['endpoints']: path.join(__dirname, 'endpoints.ts'),
    ['thread-pool']: path.join(__dirname, 'thread-pool.ts')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  target: 'node',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'PORT': JSON.stringify(process.env.PORT),
        'FRONT_URL': JSON.stringify(process.env.FRONT_URL),
        'BACKEND_URL': JSON.stringify(process.env.BACKEND_URL)
      }
    }),
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: path.resolve(__dirname, 'templates/**'), destination: path.resolve(__dirname, '../', 'dist/api/templates') },
          { source: path.resolve(__dirname, 'docs/**'), destination: path.resolve(__dirname, '../', 'dist/api/templates') },
          { source: path.resolve(__dirname, 'swagger.json'), destination: path.resolve(__dirname, '../', 'dist/api/swagger.json') }
        ]
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
    path: path.resolve(__dirname, '../', 'dist/api'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
};
