import axios from 'axios';
import { message } from 'antd';

export function fetchData(){
    return axios(...arguments).then(res => {
        
    }).catch(err => {
        message.error(err);
    });
};