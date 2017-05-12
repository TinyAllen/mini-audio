var path = require('path');
var webpack = require('webpack');
var devServer = require('webpack-dev-server');
var libraryName="Audio"
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'audio.js',
    library: libraryName,
    // libraryTarget: 'umd',
    // umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=25000'
    }]
  },

}