const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const fs = require("fs");

const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

const app = express();
const baseConfig = require('./webpack.config.base.js');
const projectConfig = require('./project.config.js');
const reg = /^[\w\_]+$/gi;

const process_cwd = process.cwd();
const mockDir = path.join(process_cwd,projectConfig.mock.path),
    mockFileList = fs.readdirSync(mockDir),
    pageDir = path.join(process_cwd,projectConfig.page.path),
    pageList = fs.readdirSync(pageDir);

const config = {...baseConfig};
config.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
);

let commom = Object.keys(projectConfig.common);
commom.map((item)=>{
  config.entry[item] = [...projectConfig.common[item]];
})
pageList.map((item) =>{
  if(reg.test(item)){
    //根据page目录设置多页入口
    config.entry[item] = [hotMiddlewareScript,path.join(pageDir,item,"index.jsx")];
    //根据page目录输出对应的模板
    config.plugins.push(new HtmlWebpackPlugin({
      template:path.join(pageDir,item,"index.html"),
      chunks:[...commom,item],
      filename:`${item}.html`
    }));
  }
})


//mock
if(projectConfig.mock.isuse){
  mockFileList.map((item) =>{
    item = item.replace(/\.\w*?$/gi,'');
    let itemPath = path.join(mockDir,`./${item}`),
        route = item.replace(/\-/gi,'/'),
        data = require(path.join(mockDir,`./${item}`));
    if(reg.test(route)){
      app.use(`/${route}`,(req,res)=>{
        res.set({
          'Content-Type': 'application/json'
        });
        res.send(JSON.stringify(data));
      }) 
    }
  })
}


const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler, {
    noInfo: true, 
    publicPath: config.output.publicPath,
    stats: {colors: true},
    lazy: false,
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    }
}));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});