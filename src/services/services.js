import Api from './apiMethods'
const baseUrl = '/api/v1/';

export function refreshToken(data= {}){
    return Api.get(baseUrl+'pub/refresh_token' ,data)
}

// export function gis(data={}){
//     return Api.get(baseUrl+'gis', data)
// }
// export function hostgroup(data={}){
//     return Api.get(baseUrl+'setting/hostgroup', data);
// }
// export function realtime(data){
//     return Api.get(baseUrl+'realtime?type=hostgroup_overview', data)
// }
// export function status(data){
//     return Api.get(baseUrl+'setting/function/status', data);
// }
// export function menus(data){
//     return Api.get(baseUrl+'menus',data);
// }
