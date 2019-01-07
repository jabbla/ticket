import React from 'react';
import moment from 'moment';
import {
    Form, Row, Col, Input, Button, Icon, DatePicker,
    Card, Table, Tag, Divider, Select
  } from 'antd';
import axios from 'axios';
import './index.mcss';
import parseStations from '../utils/parseStations';

const { ipcRenderer } = window;
const Option = Select.Option;

class Filters extends React.Component {
    constructor(props){
        super(props);
        let stations = parseStations();
        let maxOptionCount = 200;
        let initStationsForShow = stations.slice(0, maxOptionCount);
        this.state = {
            expand: false,
            stations,
            maxOptionCount,
            startStationsForShow: initStationsForShow,
            endStationsForShow: initStationsForShow
        };
        this.handleReset = this.handleReset.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleStationSearch = this.handleStationSearch.bind(this);

        this.initData();
    }
    initData(){
        ipcRenderer.send('tranListQuery-get').then(({event, arg}) => {
            this.props.getTrains({
                ...arg,
                date: moment(arg.date)
            });
            this.setState({
                defaultDate: arg.date,
                defaultStartStation: arg.startStation,
                defaultEndStation: arg.endStation
            })
        });
    }
    // To generate mock Form.Item
    getFields() {
        const count = this.state.expand ? 10 : 6;
        const { getFieldDecorator } = this.props.form;
        const children = [];
        for (let i = 0; i < 10; i++) {
        children.push(
            <Col span={8} key={i} style={{ display: i < count ? 'block' : 'none' }}>
            <Form.Item label={`Field ${i}`}>
                {getFieldDecorator(`field-${i}`, {
                rules: [{
                    required: true,
                    message: 'Input something!',
                }],
                })(
                <Input placeholder="placeholder" />
                )}
            </Form.Item>
            </Col>
        );
        }
        return children;
    }

    handleSearch(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                ipcRenderer.send('tranListQuery-set', {
                    date: values.date.format('YYYY-MM-DD'),
                    endStation: values.endStation,
                    startStation: values.startStation
                });
                this.props.getTrains(values);
            }
        });
    }

    handleStationSearch(type){

        return (inputValue) => {
            const { stations, maxOptionCount } = this.state;
            
            this.setState({
                type: stations.filter(station => new RegExp(inputValue).test(station.name)).slice(0, maxOptionCount)
            });
        };
        
    }

    disabledDate(current){
        return current && current < moment().startOf('day');
    }

    handleReset(){
        this.props.form.resetFields();
    }

    toggle(){
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { 
            startStationsForShow, endStationsForShow, defaultDate,
            defaultStartStation, defaultEndStation
        } = this.state;
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item label="车次日期">
                            {getFieldDecorator(`date`, {
                                initialValue: moment(defaultDate),
                                rules: [{
                                    required: true,
                                    message: '请输入车次日期',
                                }]
                            })(
                                <DatePicker
                                    disabledDate={this.disabledDate}
                                    placeholder="请输入车次日期"
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="起始站">
                            {getFieldDecorator(`startStation`, {
                                initialValue: defaultStartStation,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择始发站',
                                    }
                                ],
                            })(
                                <Select 
                                    showSearch 
                                    placeholder="起始站名称"
                                    onSearch={this.handleStationSearch('startStationsForShow')}
                                >
                                
                                    {startStationsForShow.map(station => <Option 
                                        key={`${station.parts[2]}+${station.name}`}
                                    >
                                        {station.name}
                                    </Option>)}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="终点站">
                            {getFieldDecorator(`endStation`, {
                                initialValue: defaultEndStation,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择终点站',
                                    }
                                ],
                            })(
                                <Select 
                                    showSearch
                                    placeholder="终点站名称"
                                    onSearch={this.handleStationSearch('endStationsForShow')}
                                >
                                
                                    {endStationsForShow.map(station => <Option
                                        initialValue={station.name === '北京'} 
                                        key={`${station.parts[2]}+${station.name}`}
                                    >
                                        {station.name}
                                    </Option>)}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Button type="primary" htmlType="submit" >查询</Button>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(Filters);