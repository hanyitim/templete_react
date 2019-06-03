const path = require('path');
const fs = require('fs');
const baseConfig = require('./webpack.config.base');
const CleanWebpackPlugin = require('clean-webpack-plugin');
     
function resolve(dir){
  return path.join(__dirname,dir);
}

var cleanWebpackPlugin = new CleanWebpackPlugin(
    ['dist'],{
        root:__dirname,
        verbose:  true,
        dry:false
    }
);
const config = baseConfig({
  output:{
    path:resolve('dist/static'),
    publicPath:"./static/"
  },
  filenameFormat:"../$name.html",
  mode:"development"
});

config.plugins.push(cleanWebpackPlugin);
module.exports = config;