const path = require('path');
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

config.plugins.push(cleanWebpackPlugin);
module.exports = config;