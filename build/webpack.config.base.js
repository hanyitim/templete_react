var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    path = require("path");

var definePlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
});
var cleanWebpackPlugin = new CleanWebpackPlugin(
    ['dist','dist_prod'],{
        root:__dirname,
        verbose:  true,
        dry:false
    }
);
function isExternal(module) {
    var context = module.context;
    if (typeof context !== 'string') {
      return false;
    }
    return context.indexOf('node_modules') !== -1;
}
var config = {
    entry:{},
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"[name].js",
        publicPath:"/",
    },
    devtool: 'inline-source-map',
    module:{
        rules:[
            {
                test:/\.(jsx|js)$/,
                exclude: /(node_modules|bower_components)/,
                use:[
                    {
                        loader:"babel-loader"
                    },
                    {
                        loader:"eslint-loader"
                    }
                ]
            },
            {
                test:/\.sass$/,
                exclude: /(node_modules|bower_components)/,
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
                        loader:"less-loader"
                    }
                ]
            },
            {
                test:/\.css$/,
                exclude: /(node_modules|bower_components)/,
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
        cleanWebpackPlugin
    ],
    cache:true
}
module.exports=config;