import axios from 'axios';
import { message } from 'antd';

export default function parseStations(){
    if(!station_names){
        message.error('获取车站列表失败！');
    }
    let stationStrs = station_names.split('@');
    let stations = [];

    for(let i = 1; i < stationStrs.length; i++){
        let stationStr = stationStrs[i];
        let parts = stationStr.split('|');

        stations.push({
            name: parts[1],
            parts
        });
    }

    return stations;
}