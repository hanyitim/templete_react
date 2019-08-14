const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const definePlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify("production"),
});
const uglifyPlugin = new UglifyJsPlugin();
const HashedModuleIdsPlugin = new webpack.HashedModuleIdsPlugin()




const config = baseConfig({
  output:{
    path:path.join(__dirname,'dist/static'),
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
config.plugins.push(uglifyPlugin,definePlugin,HashedModuleIdsPlugin);

module.exports = config;
