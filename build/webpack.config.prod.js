const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');
const projectConfig = require('./project.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const definePlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify("production")
});
const uglifyPlugin = new UglifyJsPlugin();

const process_cwd = process.cwd();
const pageDir = path.join(process_cwd,projectConfig.page.path),
      pageList = fs.readdirSync(pageDir),
      pageInfo = projectConfig.page.pageInfo;

const config = {...baseConfig};

config.output.path = path.join(__dirname,"dist_prod/static");
config.output.filename = "[hash].[name].js";
config.output.publicPath = "./static/";
// config.devtool = "";
//公共模块依赖
let commom = Object.keys(projectConfig.common);
commom.map((item)=>{
  config.entry[item] = [...projectConfig.common[item]];
})
pageList.map((item) =>{
    //根据page目录设置多页入口
    config.entry[item] = [path.join(pageDir,item,"index.jsx")];
    //根据page目录输出对应的模板
    config.plugins.push(new HtmlWebpackPlugin({
      template:path.join(pageDir,item,"index.html"),
      title:pageInfo[item]["title"] || "",
      chunks:[...commom,item],
      filename:`../${item}.html`
    }));
})

//prod  压缩
config.plugins.push(uglifyPlugin);
config.plugins.push(definePlugin);

module.exports = config;
