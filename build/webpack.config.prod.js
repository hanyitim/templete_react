const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const configUtil = require('./configUtil.js');
const envConfig = require('./envConfig.js');


const definePlugin = (option = {})=>{
  return new webpack.DefinePlugin(configUtil.formatDefine(option));
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
  useTinypng:false,
  isPro:true,
  usePwa:false
});
module.exports = (env)=>{
  config.plugins.unshift(
    definePlugin(envConfig[env.NODE_ENV] || {}),
    HashedModuleIdsPlugin
  );
  console.log(env.NODE_ENV,definePlugin(envConfig[env.NODE_ENV] || {}));
  return config;
}
