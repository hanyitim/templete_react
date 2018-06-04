var path = require('path');
var baseConfig = require('./webpack.config.base');
var utils = require('./utils.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//分析文件体积，直接push 到 plugins 里面去
var analyzer = new BundleAnalyzerPlugin({
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


var config = {...baseConfig};

config.output.path = path.join(__dirname,"dist/static");
config.output.publicPath = "./static/";
//文件分析
config.plugins.push(analyzer);

Object.keys(utils.temp).map((item)=>{
    utils.temp[item].filename = "../"+utils.temp[item].filename;
    config.plugins.push(new HtmlWebpackPlugin(utils.temp[item]));
})
Object.keys(utils.entrys).map((item)=>{
    config.entry[item] = utils.entrys[item]
})

module.exports = config;