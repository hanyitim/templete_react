const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const configUtil = require('./configUtil.js');


const definePlugin = (NODE_ENV)=>{
  return new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  });
}
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
module.exports = (env)=>{
  config.plugins.push(
    definePlugin(env.NODE_ENV),
    HashedModuleIdsPlugin
  )
}
