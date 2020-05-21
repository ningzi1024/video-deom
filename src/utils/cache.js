/**
 * 对本地存储处理，key值base64加密
 */
import base64 from "./base64";

/**
 * 是否使用base64
 */
const _use_base64 = false;

/**
 * 保存key的前缀,可能版本不同而修改
 */
const _key_prefix = '20drsCI';

function _getValue(key){
    let value = localStorage.getItem(_key_prefix + key);
    if(_use_base64)
        value = base64.decode(value);
    return value;
}

function _setValue(key, value) {
    let saveValue = value;
    if(typeof value !== 'string') throw 'value must be string type';
    if(_use_base64)
        saveValue = base64.encode(value)
    localStorage.setItem(_key_prefix+key, saveValue);
}

const keys = {
    token: '01',
    expires_at: '05',
    user: '02',
    lang: '03',
    themeColor: '04'
};

class Cache {
    /**
     * 用户登录token
     * @returns {string | string}
     */
    static get token(){
        return _getValue(keys.token) || '';
    }
    static set token(value){
        return _setValue(keys.token, value);
    }

    /**
     * token过期时间
     * @returns {string}
     */
    static get expires_at(){
        return _getValue(keys.expires_at);
    }
    static set expires_at(value){
        return _setValue(keys.expires_at, value);
    }

    /**
     * 用户名
     * @returns {string}
     */
    static get user(){
        return _getValue(keys.user);
    }
    static set user(value){
        return _setValue(keys.user, value);
    }

    /**
     * 语音种类
     * @returns {string}
     */
    static get lang(){
        return _getValue(keys.lang);
    }
    static set lang(value){
        return _setValue(keys.lang, value);
    }

    /**
     * 皮肤颜色保存
     * @returns {string}
     */
    static get themeColor(){
        return _getValue(keys.themeColor);
    }
    static set themeColor(value){
        return _setValue(keys.themeColor, value);
    }
}

export default Cache;