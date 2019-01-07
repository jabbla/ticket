import axios from 'axios';

function isLogined(){
    return axios({
        url: '/passport/web/auth/uamtk-static',
        method: 'post',
        baseURL: 'https://kyfw.12306.cn/',
        headers: { 'content-type': 'application/x-www-form-urlencoded'},
        params: {
            appid: 'otn'
        }
    }).then(res => {
        res = res.data;
        if(res.result_code === 0){
            return Promise.resolve(res.name);
        }

        if(res.result_code === -4){
            return Promise.reject({readyForLogin: false, message: res.result_message, maintaining: true});
        }

        if(res.result_code < 0){
            return Promise.reject({readyForLogin: false, message: res.result_message});
        }

        if(res.result_code === 4){
            return Promise.reject({readyForLogin: false, message: res.result_message, otherPlaceLogined: true});
        }

        return Promise.reject({readyForLogin: true, message: res.result_message});
    })
}

export default isLogined;