const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require("path");
const inquirer = require('inquirer');
const open = require('open');
const configUtil = require('./configUtil.js');
const envConfig = require('./envConfig.js');


const app = express();
const baseConfig = require('./webpack.config.base.js');
const projectConfig = require('./project.config.js');



const definePlugin = new webpack.DefinePlugin(configUtil.formatDefine(envConfig['dev']));
const config = baseConfig({
    isHot:true,
    output:{
      publicPath:projectConfig.pathname
    }
});
config.plugins.push(definePlugin);

//监听端口
function listen(port){
  app.listen(port,()=>{
    console.log(`Example app listening on port ${port}!\n`);
    console.log(path.join(`http://localhost:${port}`,projectConfig.pathname));
    open(path.join(`http://localhost:${port}`,projectConfig.pathname));
    toBuild();
  })
  .on('error',(err)=>{
    inquirer.prompt([
      {
        type:'confirm',
        name:'port',
        message:`:${port} used,listen port ${port+1} ?`
      }
    ])
    .then((answers) => {
      if(answers.port){
        listen(port+1)
      }
    })
  })
}
//开始构建
function toBuild(){
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    noInfo:true,
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
}

listen(3000);