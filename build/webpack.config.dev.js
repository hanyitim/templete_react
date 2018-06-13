const path = require('path');
const fs = require('fs');
const baseConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
     
const projectConfig = require('./project.config.js');


var cleanWebpackPlugin = new CleanWebpackPlugin(
    ['dist'],{
        root:__dirname,
        verbose:  true,
        dry:false
    }
);

const process_cwd = process.cwd();
const pageDir = path.join(process_cwd,projectConfig.page.path),
      pageList = fs.readdirSync(pageDir);

const config = {...baseConfig};

config.output.path = path.join(__dirname,"dist/static");
config.output.publicPath = "./static/";

config.plugins.push(cleanWebpackPlugin);

//公共模块依赖
let commom = Object.keys(projectConfig.common);
commom.map((item)=>{
  config.entry[item] = [...projectConfig.common[item]];
})
pageList.map((item) =>{
  if(/^[\w\_]+$/gi.test(item)){
    //根据page目录设置多页入口
    config.entry[item] = [path.join(pageDir,item,"index.jsx")];
    //根据page目录输出对应的模板
    config.plugins.push(new HtmlWebpackPlugin({
      template:path.join(pageDir,item,"index.html"),
      chunks:["vendor",item],
      filename:`${item}.html`
    }));
  }
})

config.mode='development',
module.exports = config;