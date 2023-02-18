'use strict';

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const PATHS = require('./paths');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      popup: PATHS.src + '/popup.js',
      content_Youtube: PATHS.src + '/content_Youtube.js',
      background: PATHS.src + '/background.js',
      api: PATHS.src + '/api.js',
      Registration: PATHS.public + '/components/Registration.jsx',
      LogIn: PATHS.public + '/components/LogIn.jsx',
      userDashboard: PATHS.public + '/components/userDashboard.jsx',
      indexPopup: PATHS.public + '/indexPopup.js',
      Theme: PATHS.public + '/components/Theme.jsx',
      goPremiumFooter: PATHS.public + '/components/modules/goPremiumFooter.jsx',
    },
    module: {
      rules: [
        {
          test: /\.jsx$||\.ts$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', "@babel/preset-typescript"]
            }
          }
        },
          {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"
          ],
          }
      ]
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    //devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
