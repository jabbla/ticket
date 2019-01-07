import axios from 'axios';

export default function logout(){
    ipcRenderer.send('logout');
    return axios({
        url: 'https://kyfw.12306.cn/otn/login/loginOut',
        method: 'get'
    });
}