const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const configUtil = require('./configUtil.js');
     
const config = baseConfig({
  output:{
    path:configUtil.pathPwd('dist/static'),
    publicPath:"./static/"
  },
  filenameFormat:"../$name.html",
  mode:"development"
});
config.plugins.unshift(new webpack.DefinePlugin({
  NODE_ENV:JSON.stringify('dev')
}));

module.exports = config;