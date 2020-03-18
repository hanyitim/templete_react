const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require("path");
const fs = require("fs");
const inquirer = require('inquirer');
const open = require('open');


const app = express();
const baseConfig = require('./webpack.config.base.js');
const projectConfig = require('./project.config.js');

const process_cwd = process.cwd();
const mockDir = path.join(process_cwd,projectConfig.mock.path),
      mockFileList = fs.readdirSync(mockDir);


const definePlugin = new webpack.DefinePlugin({
    NODE_ENV:JSON.stringify('dev')
});
const config = baseConfig({
    isHot:true,
    output:{
      publicPath:projectConfig.pathname
    },
    defineOption:{
      isDev:true
    },
});
config.plugins.push(definePlugin);
//mock
if(projectConfig.mock.isuse){
  mockFileList.map((item) =>{
    if(/^[a-zA-Z][\w-]+\.json$/gi.test(item)){
      item = item.replace(/\.\w*?$/gi,'');
      let route = item.replace(/\-/gi,'/');
          
      app.use(`/${route}`,(req,res)=>{
        let data = fs.readFileSync(path.join(mockDir,`./${item}.json`),'utf8');
        res.set({
          'Content-Type': 'application/json'
        });
        res.send(data);
      })
    }
  })
}

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