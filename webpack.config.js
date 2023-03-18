const path = require('path');
const Dotenv = require('dotenv-webpack');
const pathBrowserify = require('path-browserify');

module.exports = {
  mode: 'development',
  entry: './assets/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new Dotenv(),
  ],
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      os: false
    }
  }
};
