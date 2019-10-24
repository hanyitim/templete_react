const path = require('path'),
      webpack = require('webpack'),
      pwd = process.cwd(),
      projectConfig = require('./project.config.js'),
      fs = require("fs"),
      isSPA = projectConfig.isSPA,
      pageDir = pathPwd("./src/page"),
      pageList = fs.readdirSync(pageDir),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true',
      WorkboxPlugin = require('workbox-webpack-plugin'),
      tinyPngWebpackPlugin = require('tinypng-webpack-plugin'),
      BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
      OpimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
      MinicssExtractPlugin = require('mini-css-extract-plugin');

//分析文件体积，直接push 到 plugins 里面去
const analyzer = new BundleAnalyzerPlugin({
    analyzerMode: 'server',
      analyzerHost: 'localhost',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
});

//tinypny 图片压缩
const tinypng = new tinyPngWebpackPlugin({
    key:projectConfig.tinypngKeys,  
    ext:['png','jpeg','jpg']
})

function pathPwd(){
    let _arguments = Array.prototype.slice.call(arguments,0);
    _arguments.unshift(pwd);
    return path.join.apply(null,_arguments);
}

function pathDirname(){
    let _arguments = Array.prototype.slice.call(arguments,0);
    _arguments.unshift(__dirname);
    return path.join.apply(null,_arguments);
}

function getCssLoader(suffix=".css",options={}){
    let loaders = [],
        {isPro,useModule} = options;
    if(isPro){
        loaders.push({loader:MinicssExtractPlugin.loader,options:{publicPath:"./"}})
    }else{
        loaders.push({loader:"style-loader"})
    }
    if(useModule){
        loaders.push({
            loader:"css-loader",
            options:{
                modules:true,
                localsConvention:"camelCaseOnly",
                sourceMap:true
            }
        })
    }else{
        loaders.push({
            loader:"css-loader",
        })
    }
    loaders.push({
        loader: 'postcss-loader', 
        options: useModule ? {
            sourceMap:true,
            config:{
                path:pathPwd()
            }
        }:{}
    })
    switch(suffix){
        case ".less":
            loaders.push({
                loader:"less-loader",
                options:{
                    sourceMap:true
                }
            })
            break;
        case ".normal.less":
            loaders.push({loader:"less-loader"})
            break;
    }
    return loaders;
}

function getBabelLoader(){
    let loaders = [];
    loaders.push(
    {
        loader:"babel-loader",
        options:{
            cacheDirectory:true
        }
    },
    {
        loader:"eslint-loader",
        options:{
            cache:true,
            failOnError: true
        }
    }
    );
    return loaders;
}
function getHtmlPlugins(filenameFormat = false){
    let plugins = [];
    if(isSPA){
        plugins.push(new HtmlWebpackPlugin({
            template:pathPwd("./src/page/index.html"),
            chunks:["vendor","main"],
            filename: filenameFormat ? `${filenameFormat.replace(/\$name/gi,"index")}` : `index.html`
        }));
    }else{
        pageList.forEach((item) =>{
            if(/^[\w\-]+$/gi.test(item)){
                if(/^normal([\w\-]+)$/gi.test(item)){
                    //单纯的html文件
                    plugins.push(new HtmlWebpackPlugin({
                        template:path.join(pageDir,item,"index.html"),
                        chunks:[],
                        filename: filenameFormat ? `${filenameFormat.replace(/\$name/gi,item)}` : `${item}.html`,
                        minify:true
                    }));
                }
                else if(/^[\w\-]+$/gi.test(item)){
                    //根据page目录输出对应的模板
                    plugins.push(new HtmlWebpackPlugin({
                        template:path.join(pageDir,item,"index.html"),
                        chunks:["vendor",item],
                        filename: filenameFormat ? `${filenameFormat.replace(/\$name/gi,item)}` : `${item}.html`,
                        minify:true
                    }));
                }
            }
        });
    }
    return plugins;
}
function getOutput(option = {}){
    var defaultOpt = {
        path:pathPwd("dist"),
        filename:"[name].js",
        publicPath:"/",
        chunkFilename:"[name].chunk.js"
    };
    return Object.assign(defaultOpt,option);
}
function getCacheGroups(){
    //CacheGroups
    var cacheGroups = {};
    cacheGroups.vendor = {
        test: /[\\/]node_modules[\\/]/,
        name:'vendor',
        chunks:'all',
        minChunks:pageList.length > 1 && !isSPA ? 2 : 1
    }
    return cacheGroups;
}

//获取入口
function getEntry(isHot=false){
    var entry = {};
    if(isSPA){
         //main entry
        entry["main"] = [path.join(pageDir,"main.jsx")];
        isHot && entry["main"].unshift(hotMiddlewareScript);
    }else{
        //page entry
        pageList.forEach((item) =>{
            if(/^[\w\_]+$/gi.test(item) && /^normal([\w\-]+)$/gi.test(item) !== true){
                //根据page目录设置多页入口
                entry[item] = [path.join(pageDir,item,"index.jsx")];
                isHot && entry[item].unshift(hotMiddlewareScript);
            }
        })
    }
    return entry;
}

function getPlugins(option=[]){
    let {
        isHot,
        useAnalyzer,
        useTinypng,
        usePwa,
        filenameFormat,
        isPro
    } = option,
        plugins = [];
    if(isHot){
        plugins.push(new webpack.HotModuleReplacementPlugin())
    }
    plugins = plugins.concat(getHtmlPlugins(filenameFormat));
    if(isPro){
        plugins.push(new MinicssExtractPlugin({
            filename:'[name].[contenthash].css',
            chunkFilename:'[id].[contenthash].css'
        }),new OpimizeCSSAssetsPlugin({}))
    }
    if(useAnalyzer){
        plugins.push(analyzer);
    }
    if(useTinypng){
        plugins.push(tinypng);
    }
    if(usePwa){
        plugins.push(new WorkboxPlugin.GenerateSW({
            clientsClaim:true,
            skipWaiting:true,
            swDest:"../service-worker.js"
        }))
    }
    return plugins;
}

module.exports = {
    pathPwd,
    pathDirname,
    getPlugins,
    getCssLoader,
    getBabelLoader,
    getOutput,
    getEntry,
    getCacheGroups
}