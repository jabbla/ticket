import axios from 'axios';
import Cookies from 'js-cookie';

function conf(){
    console.log('conf');
    return axios({
        url: 'https://kyfw.12306.cn/otn/login/conf',
        method: 'post',
        params: {}
    }).then(res => {
        console.log(res);
    });
}

function uamtkStatic(){
    return axios({
        url: '/passport/web/auth/uamtk-static',
        method: 'post',
        baseURL: 'https://kyfw.12306.cn/',
        headers: { 'content-type': 'application/x-www-form-urlencoded'},
        params: {
            appid: 'otn'
        }
    }).then(res => {
        console.log(res);
    })
}

function setCurrectCaptchaCheck(){
    let anwser = '181,136,109,134,255,44';
    let passportCt = '615e1ef99e8746ae9c9ee7564b2cd4act3732';

    Cookies.set('_passport_ct', passportCt);
}


export default function setPassports(){
    return conf().then(() => uamtkStatic());
}