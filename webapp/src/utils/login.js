import axios from 'axios';

export default function login({username, password, answer}){
    return axios({
        url: 'https://kyfw.12306.cn/passport/web/login',
        method: 'post',
        headers: { 
            'content-type': 'application/x-www-form-urlencoded'
        },
        params: {
            username, password,
            appid: 'otn',
            answer
        }
    }).then(res => {
        if(res.data.result_code == 0){
            ipcRenderer.send('userSession', {
                uamtk: res.data.uamtk
            });
        }
        return res;
    });
}