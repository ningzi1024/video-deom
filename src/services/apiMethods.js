import service from './apiBase'
import QS from 'qs';

const ApiMethods = {
    get(url, params){
        return new Promise((resolve, reject)=>{
            service.get(url,{
                params: params
            }).then(res=>{
                resolve(res.data)
            }).catch(err=>{
                reject(err)
            })
        })
    },
    post(url, params){
        return new Promise((resolve, reject)=>{
            service.post(url, QS.stringify(params)).then(res=>{
                resolve(res.data)
            }).catch(err=>{
                reject(err)
            })
        })
    }
}

export default ApiMethods;