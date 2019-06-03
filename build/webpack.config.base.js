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
    // commons = projectConfig.common,
    isSPA = projectConfig.isSPA,
    // commomsKey = Object.keys(commons),
    MinicssExtractPlugin = require('mini-css-extract-plugin'),
    tinyPngWebpackPlugin = require('tinypng-webpack-plugin');


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
//tinypny 图片压缩
const tinypng = new tinyPngWebpackPlugin({
    key:projectConfig.tinypngKeys,  
    ext:['png','jpeg','jpg']
})

//获取入口
function getEntry(isHot=false){
    var entry = {};
    //common entry
    // Object.keys(commons).forEach((item) => {
    //     entry[item] = commons[item];
    // });
    if(isSPA){
         //main entry
        entry["main"] = [path.join(pageDir,"main.jsx")];
        isHot && entry["main"].unshift(hotMiddlewareScript);
    }else{
        //page entry
        pageList.forEach((item) =>{
            if(/^[\w\_]+$/gi.test(item)){
                //根据page目录设置多页入口
                entry[item] = [path.join(pageDir,item,"index.jsx")];
                isHot && entry[item].unshift(hotMiddlewareScript);
            }
        })
    }
    return entry;
}
function getCacheGroups(){
    //CacheGroups
    var cacheGroups = {};
    // Object.keys(commons).forEach((item) => {
    //     cacheGroups[item] = {
    //         name:item,
    //         filename:`${item}.js`,
    //         chunks: 'initial'
    //     }
    // });
    cacheGroups.vendor = {
        test: /[\\/]node_modules[\\/]/,
        name:'vendor',
        chunks:'all'
    }
    return cacheGroups;
}
function getHtmlPlugins(filenameFormat = false){
    let plugins = [];
    if(isSPA){
        plugins.push(new HtmlWebpackPlugin({
            template:path.join(pageDir,"page.html"),
            // chunks:[...commomsKey,"main"],
            chunks:["vendor","main"],
            filename: filenameFormat ? `${filenameFormat.replace(/\$name/gi,"page")}` : `page.html`
        }));
    }else{
        pageList.forEach((item) =>{
            if(/^[\w\-]+$/gi.test(item)){
                //根据page目录输出对应的模板
                plugins.push(new HtmlWebpackPlugin({
                    template:path.join(pageDir,item,"index.html"),
                    // chunks:[...commomsKey,item],
                    chunks:["vendor",item],
                    filename: filenameFormat ? `${filenameFormat.replace(/\$name/gi,item)}` : `${item}.html`
                }));
            }
        });
    }
    return plugins;
}
function getPlugins(isHot = false,filenameFormat = false,isPro = false){
    var plugins = [];
    if(isHot){
        plugins.push(new webpack.HotModuleReplacementPlugin())
    }
    plugins = plugins.concat(getHtmlPlugins(filenameFormat));
    if(isPro){
        plugins.push(new MinicssExtractPlugin({
            filename:'[name].[contenthash].css',
            chunkFilename:'[id].[contenthash].css'
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
    var {
        isHot,
        isPro,
        filenameFormat,
        useAnalyzer,
        useTinypng,
        output,
        mode,
        devtool
    } = option;

    var config = {
        entry:getEntry(isHot) || {},
        output:getOutput(output),
        mode: mode || 'none',
        resolve:{
            alias:{
                "@page":absolute("./src/page/"),
                "@widget":absolute("./src/widget/"),
                "@css":absolute("./src/css/"),
                "@js":absolute("./src/js/"),
                "@mobx":absolute("./src/mobx/"),
                "@src":absolute("./src/")
            },
            modules:[absolute('./node_modules')]
        },
        devtool: devtool || 'inline-source-map',
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
                        },
                        {
                            loader:"eslint-loader",
                            options:{
                                fix:true
                            }
                        },
                        {
                            loader:'webpack-remove-block-loader',
                            options:{
                                active:isPro
                            }
                        }
                    ]
                },
                {
                    test:/\.sass$/,
                    exclude: /(node_modules|bower_components)/,
                    include:absolute("./src"),
                    use:[
                        isPro ? {loader:MinicssExtractPlugin.loader,options:{publicPath:"./"}}:{
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
                        isPro ? {loader:MinicssExtractPlugin.loader,options:{publicPath:"./"}}:{
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
                        isPro ? {loader:MinicssExtractPlugin.loader,options:{publicPath:"./"}}:{
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
                        isPro ? {loader:MinicssExtractPlugin.loader,options:{publicPath:"./"}}:{
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
            ...getPlugins(isHot,filenameFormat,isPro)
        ],
        optimization: {
            splitChunks: {
                cacheGroups: getCacheGroups()
            }
        },
        cache:true
    }
    if(useAnalyzer){
        config.plugins.push(analyzer);
    }
    if(useTinypng){
        config.plugins.push(tinypng);
    }
    return config;
}