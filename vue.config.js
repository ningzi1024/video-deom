module.exports={
    publicPath:'./',
    outputDir: 'dist',
    assetsDir: 'static',
    devServer:{
        port: 8080,
        proxy: {        
            '/api/v1': {
                target: 'http://192.168.1.226:8800/api/v1',
                changeOrigin: true,
                timeout: 3000,
                pathRewrite: {
                    '^/api/v1': ''
                }
            },
            '/static/mapdata': {
                target: 'http://192.168.1.226:8800/static/mapdata',
                changeOrigin: true,
                timeout: 3000,
                pathRewrite: {
                    '^/static/mapdata': ''
                }
            },
            // '/api/': {
            //     target: 'http://192.168.1.103/api/',
            //     changeOrigin: true,
            //     pathRewrite: { '^/api/': '' }
            // }
        }
    }
}