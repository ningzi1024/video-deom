const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const webpack = require('webpack')

module.exports={
    publicPath:'./',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap:false,
    devServer:{
        port: 8080,
        proxy: {
            '/api/': {
                target: 'http://192.168.1.54:8080',
                changeOrigin: true,
                pathRewrite: { '^/api/': '' }
            }
        }
    },
    css:{
        loaderOptions: {
            postcss: {
                plugins:[
                    autoprefixer(),
                    pxtorem({
                        rootValue: 100,
                        propList: ['*'],
                        selectorBlackList: ['.el-','el-','van-']
                    })
                ]
            }
        }
    },
    configureWebpack:{
        plugins:[
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
                minChunkSize: 100
            })
        ]
    }
}