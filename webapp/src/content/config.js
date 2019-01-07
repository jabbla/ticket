import React from 'react';
import {
    Row, Col, Button, Card, Table,
  } from 'antd';

const emptyRender = (text) => {
    text = text.trim();
    
    if(text === '无' || !text || text === '0'){
        return '无';
    }

    return (<a>{text}</a>)
};

export const columns = (ctx) => ([
    {
        title: '车次',
        dataIndex: 'trainId',
        key: 'trainId',
        render: text => <a href="javascript:;">{text}</a>,
    }, 
    {
        title: <p>出发站<br/>终点站</p>,
        dataIndex: 'startEndStation',
        key: 'startEndStation',
        render: text => {
            let parts = text.split('-');
            return (<p><span>{parts[0]}</span><br/><span>{parts[1]}</span></p>)
        }
    }, 
    {
        title: <p>出发时间<br/>到达时间</p>,
        dataIndex: 'startEndTime',
        key: 'startEndTime',
        render: text => {
            let parts = text.split('-');
            return (<p><span>{parts[0]}</span><br/><span>{parts[1]}</span></p>)
        }
    },
    {
        title: '商务座',
        dataIndex: 'busnessSeat',
        key: 'busnessSeat',
        render: text => emptyRender(text)
    },
    {
        title: '一等座',
        dataIndex: 'firstSeat',
        key: 'firstSeat',
        render: text => emptyRender(text)
    },
    {
        title: '二等座',
        dataIndex: 'secondSeat',
        key: 'secondSeat',
        render: text => emptyRender(text)
    },
    {
        title: '高级软卧',
        dataIndex: 'advanceSoftBed',
        key: 'advanceSoftBed',
        render: text => emptyRender(text)
    },
    {
        title: '软卧',
        dataIndex: 'softBed',
        key: 'softBed',
        render: text => emptyRender(text)
    },
    {
        title: <p>硬卧<br/>二等卧</p>,
        dataIndex: 'hardBed',
        key: 'hardBed',
        render: text => emptyRender(text)
    },
    {
        title: '硬座',
        dataIndex: 'hardSeat',
        key: 'hardSeat',
        render: text => emptyRender(text)
    },
    {
        title: '无座',
        dataIndex: 'noSeat',
        key: 'noSeat',
        render: text => emptyRender(text)
    },
    {
        title: '操作',
        key: 'action'
    }
])