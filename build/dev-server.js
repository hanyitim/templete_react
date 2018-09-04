const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require("path");
const fs = require("fs");


const app = express();
const baseConfig = require('./webpack.config.base.js');
const projectConfig = require('./project.config.js');

const process_cwd = process.cwd();
const mockDir = path.join(process_cwd,projectConfig.mock.path),
      mockFileList = fs.readdirSync(mockDir);


const config = baseConfig({
    isHot:true
});
//mock
if(projectConfig.mock.isuse){
  mockFileList.map((item) =>{
    if(/^[a-zA-Z-_]+\.json$/gi.test(item)){
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