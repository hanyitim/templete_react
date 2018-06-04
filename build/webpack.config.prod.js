var path = require('path');
var baseConfig = require('./webpack.config.base');
var utils = require('./utils.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');



var uglifyPlugin = new UglifyJsPlugin();


var config = {...baseConfig};

config.output.path = path.join(__dirname,"dist_prod/static");
config.output.filename = "[hash].[name].js";
config.output.publicPath = "./static/";
Object.keys(utils.temp).map((item)=>{
    utils.temp[item].filename = "../"+utils.temp[item].filename;
    config.plugins.push(new HtmlWebpackPlugin(utils.temp[item]));
})

Object.keys(utils.entrys).map((item)=>{
    config.entry[item] = utils.entrys[item]
})

//prod  压缩
config.plugins.push(uglifyPlugin);

module.exports = config;
