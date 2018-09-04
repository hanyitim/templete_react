const webpack = require('webpack'),
    path = require("path"),
    fs = require("fs"),
    process_cwd = process.cwd(),
    projectConfig = require('./project.config.js'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true',
    pageDir = path.join(process_cwd,projectConfig.page.path),
    pageList = fs.readdirSync(pageDir),
    commons = projectConfig.common,
    commomsKey = Object.keys(commons),
    MinicssExtractPlugin = require('mini-css-extract-plugin');



function absolute(dir){
    return path.join(process_cwd,dir);
}
function resolve(dir){
    return path.join(__dirname,dir);
}
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

function getEntry(isHot=false){
    var entry = {};
    //common entry
    Object.keys(commons).forEach((item) => {
        entry[item] = commons[item];
    });
    //page entry
    pageList.forEach((item) =>{
        if(/^[\w\_]+$/gi.test(item)){
            //根据page目录设置多页入口
            entry[item] = [path.join(pageDir,item,"index.jsx")];
            isHot && entry[item].unshift(hotMiddlewareScript);
        }
    })
    return entry;
}
function getCacheGroups(){
    //CacheGroups
    var cacheGroups = {};
    Object.keys(commons).forEach((item) => {
        cacheGroups[item] = {
            name:item,
            // filename:`${item}.js`,
            chunks: 'initial'
        }
    });
    return cacheGroups;
}
function getPlugins(isHot = false,filenameFormat = false,isPro = false){
    var plugins = [];
    if(isHot){
        plugins.push(new webpack.HotModuleReplacementPlugin())
    }
    pageList.forEach((item) =>{
        if(/^[\w\_]+$/gi.test(item)){
            //根据page目录输出对应的模板
            plugins.push(new HtmlWebpackPlugin({
                template:path.join(pageDir,item,"index.html"),
                chunks:[...commomsKey,item],
                filename: filenameFormat ? `${filenameFormat.replace(/\$name/gi,item)}` : `${item}.html`
            }));
        }
    });
    if(isPro){
        plugins.push(new MinicssExtractPlugin({
            filename:'[name].[hash].css',
            chunkFilename:'[id].[hash].css'
        }))
    }
    return plugins;
}
function getOutput(option = {}){
    var defaultOpt = {
        path:resolve("dist"),
        filename:"[name].js",
        publicPath:"/",
    };
    return Object.assign(defaultOpt,option);
}
module.exports = function(option = {}){
   
    var config = {
        entry:getEntry(option.isHot) || {},
        output:getOutput(option.output),
        mode: option.mode || 'none',
        resolve:{
            alias:{
                "@page":absolute("./src/page/"),
                "@widget":absolute("./src/widget/"),
                "@css":absolute("./src/css/"),
                "@js":absolute("./src/js/"),
                "@mobx":absolute("./src/mobx/")
            },
            modules:[absolute('./node_modules')]
        },
        devtool: option.devtool || 'inline-source-map',
        watchOptions:{
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/
        },
        module:{
            rules:[
                {
                    test:/\.(jsx|js)$/,
                    exclude: /(node_modules|bower_components)/,
                    include:absolute("./src"),
                    use:[
                        {
                            loader:"babel-loader",
                            options:{
                                cacheDirectory:true
                            }
                        }
                    ]
                },
                {
                    test:/\.sass$/,
                    exclude: /(node_modules|bower_components)/,
                    include:absolute("./src"),
                    use:[
                        option.isPro ? {loader:MinicssExtractPlugin.loader}:{
                            loader:"style-loader"
                        },
                        {
                            loader:"css-loader"
                        },
                        {
                            loader: 'postcss-loader', 
                            options: { 
                                config:{
                                    path:resolve("/postcss.config.js")
                                }
                            }
                        },
                        {
                            loader:"sass-loader"
                        }
                    ]
                },
                {
                    test:/\.less$/,
                    exclude: /(node_modules|bower_components|\.normal.less)/,
                    include:absolute("./src"),
                    use:[
                        option.isPro ? {loader:MinicssExtractPlugin.loader}:{
                            loader:"style-loader"
                        },
                        {
                            loader:"css-loader",
                            options:{
                                modules:true,
                                localIdentName:"[hash:base64:5]",
                                sourceMap:true
                            }
                        },
                        {
                            loader:"resolve-url-loader",
                            options:{
                                sourceMap:true
                            }
                        },
                        {
                            loader: 'postcss-loader', 
                            options: { 
                                sourceMap:true,
                                config:{
                                    path:resolve("/postcss.config.js")
                                }
                            }
                        },
                        {
                            loader:"less-loader",
                            options:{
                                sourceMap:true
                            }
                        }
                    ]
                },
                {
                    test:/\.normal\.less$/,
                    exclude: /(node_modules|bower_components)/,
                    include:absolute("./src"),
                    use:[
                        option.isPro ? {loader:MinicssExtractPlugin.loader}:{
                            loader:"style-loader"
                        },
                        {
                            loader:"css-loader",
                        },
                        {
                            loader:"less-loader"
                        }
                    ]
                },
                {
                    test:/\.css$/,
                    use:[
                        option.isPro ? {loader:MinicssExtractPlugin.loader}:{
                            loader:"style-loader"
                        },
                        {
                            loader:"css-loader"
                        },
                        {
                            loader: 'postcss-loader', 
                            options: { 
                                config:{
                                    path:path.join(__dirname,"/postcss.config.js")
                                }
                            }
                        }
                    ]
                },
                {
                    test:/\.(jpg|png|gif)$/,
                    exclude: /(node_modules|bower_components)/,
                    use:{
                        loader:"url-loader",
                        options:{
                            limit:1024*2
                        }
                    }
                },
                {
                    test: /\.(swf|woff|woff2|eot|ttf|svg)$/,
                    use:"file-loader"
                }
            ]
        },
        plugins:[
            ...getPlugins(option.isHot,option.filenameFormat,option.isPro)
        ],
        optimization: {
            splitChunks: {
                cacheGroups: getCacheGroups()
            }
        },
        cache:true
    }
    if(option.useAnalyzer){
        config.plugins.push(analyzer);
    }
    return config;
}