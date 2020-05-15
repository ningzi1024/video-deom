module.exports={
    publicPath:'./',
    outputDir: 'dist',
    assetsDir: 'static',
    devServer:{
        port: 8080,
        proxy: {
            '/api/': {
                target: 'http://192.168.1.54:8080',
                changeOrigin: true,
                pathRewrite: { '^/api/': '' }
            }
        }
    }
}