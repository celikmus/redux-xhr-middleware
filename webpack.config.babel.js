import path from 'path';
import webpack from 'webpack';

export default {
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'src')
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      include: [path.join(__dirname, 'src')],
      loader: 'babel'
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    sourceMapFilename: '[file].map',
    libraryTarget: 'umd',
    library: 'ReduxXhrMiddleware'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
