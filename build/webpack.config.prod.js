const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const configUtil = require('./configUtil.js');


const definePlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify("production"),
});
const HashedModuleIdsPlugin = new webpack.HashedModuleIdsPlugin()




const config = baseConfig({
  output:{
    path:configUtil.pathPwd('dist/static'),
    publicPath:"./static/",
    filename:"[name]_[contenthash].js"
  },
  filenameFormat:"../$name.html",
  mode:"production",
  devtool:"source-map",
  useAnalyzer:false,
  useTinypng:true,
  isPro:true,
  usePwa:true
});
//prod  压缩
config.plugins.push(definePlugin,HashedModuleIdsPlugin);

module.exports = config;
