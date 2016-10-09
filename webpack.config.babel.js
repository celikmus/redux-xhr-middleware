import webpack from 'webpack';
import path from 'path';

const { NODE_ENV } = process.env;

const plugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
  })
];

const filename = `redux-xhr.${NODE_ENV}.js`;

export default {
  module: {
    loaders: [
      { test: /\*dex.js?$/,
        loaders: 'babel',
        include: path.resolve(__dirname, 'src')
      }
    ]
  },
  entry: [
    'whatwg-fetch',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename,
    library: 'ReduxXhr',
    libraryTarget: 'umd'
  },
  plugins
};
