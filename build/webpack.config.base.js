const  configUtil = require('./configUtil.js'),
       speedMeasurePlguin = require("speed-measure-webpack-plugin"),
       smp = new speedMeasurePlguin();

module.exports = function(option = {}){
    var {
        isHot,
        isPro,
        output,
        mode,
        devtool
    } = option;

    var config = {
        entry:configUtil.getEntry(isHot) || {},
        output:configUtil.getOutput(output),
        mode: mode || 'none',
        resolve:{
            alias:{
                "@":configUtil.pathPwd("./src/")
            },
            modules:[configUtil.pathPwd('./node_modules')]
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
                    include:configUtil.pathPwd("./src"),
                    use:configUtil.getBabelLoader()
                },
                {
                    test:/\.less$/,
                    exclude: /(node_modules|bower_components|\.normal.less)/,
                    include:configUtil.pathPwd("./src"),
                    use:configUtil.getCssLoader(".less",{isPro,useModule:true})
                },
                {
                    test:/\.normal\.less$/,
                    exclude: /(node_modules|bower_components)/,
                    include:configUtil.pathPwd("./src"),
                    use:configUtil.getCssLoader(".normal.less",{isPro})
                },
                {
                    test:/\.css$/,
                    use:configUtil.getCssLoader(".css",{isPro})
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
        plugins:configUtil.getPlugins(option),
        optimization: {
            splitChunks: {
                cacheGroups: configUtil.getCacheGroups()
            }
        },
        cache:true
    }
    return smp.wrap(config);
}