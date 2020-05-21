const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')

module.exports={
    publicPath:'./',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap:false,
    devServer:{
        port: 8080,
        proxy: {
            // '/api/': {
            //     target: 'http://192.168.1.54:8081',
            //     changeOrigin: true,
            //     pathRewrite: { '^/api/': '' }
            // },
            '/api/v1': {
                target: 'http://192.168.1.226:8800/api/v1',
                changeOrigin: true,
                timeout: 5000,
                pathRewrite: {
                    '^/api/v1': ''
                }
            },
            // '/api/v2': {
            //     target: 'http://192.168.1.226:8800/api/v1',
            //     changeOrigin: true,
            //     timeout: 3000,
            //     pathRewrite: {
            //         '^/api/v2': ''
            //     }
            // },
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
    configureWebpack:
        {
            plugins: [
                new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
                new webpack.optimize.LimitChunkCountPlugin({
                    maxChunks: 5,
                    minChunkSize: 100
                }),
                new CompressionPlugin({
                    test: /\.js$|\.css/,
                    algorithm: 'gzip',
                    threshold: 10240,
                    minRatio: 0.8,
                    deleteOriginalAssets: false
                })
            ]
        }


}