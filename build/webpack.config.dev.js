const path = require('path');
const fs = require('fs');
const baseConfig = require('./webpack.config.base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const projectConfig = require('./project.config.js');


//分析文件体积，直接push 到 plugins 里面去
const analyzer = new BundleAnalyzerPlugin({
    analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
});

const process_cwd = process.cwd();
const pageDir = path.join(process_cwd,projectConfig.page.path),
      pageList = fs.readdirSync(pageDir),
      pageInfo = projectConfig.page.pageInfo;

const config = {...baseConfig};

config.output.path = path.join(__dirname,"dist/static");
config.output.publicPath = "./static/";

//文件分析
config.plugins.push(analyzer);

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
module.exports = config;