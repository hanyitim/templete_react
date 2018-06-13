const webpack = require('webpack'),
    path = require("path"),
    fs = require("fs"),
    process_cwd = process.cwd(),
    projectConfig = require('./project.config.js'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true',
    pageDir = path.join(process_cwd,projectConfig.page.path),
    pageList = fs.readdirSync(pageDir);



function absolute(dir){
    return path.join(process_cwd,dir);
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

//处理公共模块抽取
function getCommonChunks(commons){
    var entry = {},
        cacheGroups = {};
    Object.keys(commons).forEach((item) => {
        entry[item] = commons[item],
        cacheGroups[item] = {
            name:item,
            filename:`${item}.js`,
            chunks: 'initial'
        }
    })
    return {
        entry,
        cacheGroups
    }
}
//获取html plugins
function getPageConfig(page,commoms,option){
    var entry={},
        plugins=[],
        defuleOption = {
            isHot:false,
            filenameFormat:"$name.html"
        };
    option = Object.assign(defuleOption,option);
    if(option.isHot){
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    page.forEach((item) =>{
        if(/^[\w\_]+$/gi.test(item)){
            //根据page目录设置多页入口
            entry[item] = [path.join(pageDir,item,"index.jsx")];
            option.isHot && entry[item].unshift(hotMiddlewareScript);
            //根据page目录输出对应的模板
            plugins.push(new HtmlWebpackPlugin({
                template:path.join(pageDir,item,"index.html"),
                chunks:[...commoms,item],
                filename:`${option.filenameFormat.replace(/\$name/gi,item)}`
            }));
        }
    })
    return {
        entry,
        plugins
    }
}
var config = {
    entry:{
        vendor:['react','react-dom']
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"[name].js",
        publicPath:"/",
    },
    mode: 'none',
    resolve:{
        alias:{
            "@page":projectConfig.page && projectConfig.page.path ? absolute(projectConfig.page.path) : absolute("./src/page/"),
            "@widget":projectConfig.widget && projectConfig.widget.path ? absolute(projectConfig.widget.path) : absolute("./src/widget/"),
            "@css":projectConfig.css && projectConfig.css.path ? absolute(projectConfig.css.path) : absolute("./src/css/"),
            "@js":projectConfig.js && projectConfig.js.path ? absolute(projectConfig.js.path) : absolute("./src/js/")
        },
        modules:[absolute('./node_modules')]
    },
    devtool: 'inline-source-map',
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
                        loader:"eslint-loader"
                    }
                ]
            },
            {
                test:/\.sass$/,
                exclude: /(node_modules|bower_components)/,
                include:absolute("./src"),
                use:[
                    {
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
                    },
                    {
                        loader:"sass-loader"
                    }
                ]
            },
            {
                test:/\.less$/,
                exclude: /(node_modules|bower_components)/,
                include:absolute("./src"),
                use:[
                    {
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
                                path:path.join(__dirname,"/postcss.config.js")
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
                test:/\.css$/,
                exclude: /(node_modules|bower_components)/,
                include:absolute("./src"),
                use:[
                    {
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
                                path:path.join(__dirname,"/postcss.config.js")
                            }
                        }
                    }
                ]
            },
            {
                test:/\.(jpg|png|gif)$/,
                exclude: /(node_modules|bower_components)/,
                include:absolute("./src"),
                use:{
                    loader:"url-loader",
                    options:{
                        limit:1024*2
                    }
                }
            },
            {
                test: /\.(swf|woff|woff2|eot|ttf|svg)$/,
                include:absolute("./src"),
                use:"file-loader"
            }
        ]
    },
    plugins:[analyzer],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    filename:'vendor.[hash:5].js',
                    chunks: 'initial'
                }
            }
        }
    },
    cache:true
}
module.exports=(function(){
    return function(option = {}){
        let {tempConfig} = option,
            commomsChunks = getCommonChunks(projectConfig.common),
            pageConfig = getPageConfig(pageList,Object.keys(projectConfig.common),tempConfig);
        
        let entry = {
            ...commomsChunks.entry,
            ...pageConfig.entry
        };
        let {cacheGroups} = commomsChunks;
        let newConfig = Object.assign(config,option.config);

        newConfig.entry = entry;
        newConfig.optimization.splitChunks.cacheGroups = cacheGroups;
        newConfig.plugins = newConfig.plugins.concat(pageConfig.plugins);
        console.log(newConfig.plugins);
        return newConfig;
    }
})();