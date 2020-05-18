const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
module.exports = ({ file }) => {
    let remUnit
    if (file && file.dirname && (file.dirname.indexOf('vant') > -1||file.dirname.indexOf('element') > -1)) {
        remUnit = 50//37.5
    } else {
        remUnit = 100//75
    }
    return {
        plugins: [
            autoprefixer(),
            pxtorem({
                rootValue: remUnit,
                propList: ['*'],
                selectorBlackList: ['el-circle__layer','van-circle__layer']
            })
        ]
    }
}　