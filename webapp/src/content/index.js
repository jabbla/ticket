import React from 'react';
import {
    Row, Col, Button, Card, Table,
  } from 'antd';
import Filters from '../filters';
import axios from 'axios';
import './index.mcss';

import { columns } from './config';

class AdvancedSearchContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            columns: columns(this),
            data: []
        };
        this.resolveTrainList = this.resolveTrainList.bind(this);
        this.handleBook = this.handleBook.bind(this);
    }
    getTrains(values){
        let { date, startStation, endStation } = values;
        let trainDate = date.format('YYYY-MM-DD');
        let fromStation = startStation && startStation.split('+')[0];
        let toStation = endStation && endStation.split('+')[0];

        this.setState({
            tableloading: true
        });
        axios.get('https://kyfw.12306.cn/otn/leftTicket/queryZ', {
            params: {
                'leftTicketDTO.train_date': trainDate,
                'leftTicketDTO.from_station': fromStation,
                'leftTicketDTO.to_station': toStation,
                'purpose_codes': 'ADULT'
            }
        }).then(res => {
            let data = this.resolveTrainList(res.data.data);
            this.setState({
                data,
                tableloading: false
            });
        });
    }
    handleBook(column){
        return () => {
            debugger;
        }
    }
    resolveTrainList(res){
        let {map} = res;
        return res.result.map(str => {
            let parts = str.split('|');
            let trainId = parts[3];
            let startStation = map[parts[6]];
            let endStation = map[parts[7]];
            let startEndStation = `${startStation}-${endStation}`;
            let startTime = parts[8];
            let endTime = parts[9];
            let startEndTime = `${startTime}-${endTime}`;

            let seatsPart = parts.slice(13);
            let busnessSeat = seatsPart[19];
            let firstSeat = seatsPart[18];
            let secondSeat = seatsPart[17];
            let advanceSoftBed = seatsPart[8];
            let softBed = seatsPart[10];
            let hardBed = seatsPart[15];
            let hardSeat = seatsPart[16];
            let noSeat = seatsPart[13];

            return {
                key: trainId,
                trainId, startStation, endStation,
                startTime, endTime, startEndStation, startEndTime,
                busnessSeat, firstSeat, secondSeat,
                advanceSoftBed, softBed, hardBed, hardSeat,
                noSeat
            };
        });
    }
    render(){
        let { columns } = this.state;
        columns = columns.map(column => {
            let assignee = {};

            if(column.key === 'action'){
                assignee = {
                    render: () => (<Button type="primary" onClick={this.handleBook(column)}>预定</Button>)
                };
            }
            return {
                ...column,
                ...assignee
            };
        });
        return (
            <div>
                <Row>
                    <Card>
                        <Filters getTrains={this.getTrains.bind(this)}/>
                    </Card>
                </Row>
                <Row className="m-content-row">
                    <Col span={24}>
                        <Card title="车次列表">
                            <Table
                                loading={this.state.tableloading}
                                pagination={false}
                                columns={columns}
                                dataSource={this.state.data}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default AdvancedSearchContent;