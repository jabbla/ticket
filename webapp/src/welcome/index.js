import React from 'react';
import { Input, Select, Icon, message, Spin, Button } from 'antd';
import './index.mcss';
import axios from 'axios';
import QueueAnim from 'rc-queue-anim';
import setPassport from '../utils/setPassports';
import login from '../utils/login';
import logout from '../utils/logout';
import isLogined from '../utils/isLogined';
import getCaptchaImg from '../utils/getCaptchaImg';
import validateCaptchaImg from '../utils/validateCaptchaImg';
import Cookies from 'js-cookie';

const InputBefore = (text) => {
    return (
        <p style={{
            width: '40px',
            display: 'felx',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0'
        }}>
        {text}
        </p>
    );
};

const WelcomeLoading = () => (
    <div className="m-welcome-loading">
        <h3>检测账号中</h3>
        <Spin/>
    </div>
)

const UserInfo = (ctx) => (
    <div className="m-user-info">
        <h4>你好，{ctx.props.username}</h4>
        <h5 className="m-btn-group">
            <QueueAnim>
                <Button
                    key="entry"
                    className="u-btn"
                    type="primary"
                    onClick={ctx.closeWelcome}
                >
                    进入应用
                </Button>
                <Button 
                    key="logout"
                    className="u-btn"
                    onClick={ctx.handleLogout}
                >
                    注销账号
                </Button>
            </QueueAnim>
        </h5>
    </div>
);

const ErrorInfo = ({ctx, error}) => (
    <div className="m-error-info">
        <h5>{error.message}</h5>
        {
            error.maintaining
                &&
            <Button
                type="primary"
                onClick={ctx.closeWelcome}
            >
                只使用查询系统
            </Button>
        }
        {
            error.otherPlaceLogined 
                &&
            <Button
                type="primary"
                onClick={ctx.showLogin}
            >
                点击强行登录
            </Button>  
        }
    </div>
);

const Login = (ctx) => {
    return (
        <div className="m-login">
            <div className="m-user-name m-login-item">
                <Input
                    type="text"
                    addonBefore={InputBefore('用户名')}
                    onChange={ctx.handleInput('username')}
                />
            </div>
            <div className="m-password m-login-item">
                <Input
                    type="password"
                    addonBefore={InputBefore('密码')}
                    onChange={ctx.handleInput('password')}
                />
            </div>
            <div className="m-captcha-image">
                {ctx.state.imageLoading? 
                <Spin />
                :
                <div className="m-image-wraper">
                    <img 
                        id="captcha-image"
                        src={`data:image/jpg;base64,${ctx.state.imageUrl}`}
                        onClick={ctx.handleImageClick}
                    />
                    <div 
                        className="m-click-wraper"
                        onClick={ctx.handleImageClick}
                    >
                        {ctx.state.clicks.map((click, index) => (
                            <div key={index} style={{position: 'absolute', top: click.y+'px', left: click.x+'px'}} className="u-click"><Icon type="check" /></div>
                        ))}
                    </div>
                    <Icon 
                        type="sync"
                        spin={false} 
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            fontSize: '16px',
                            color: '#aaa',
                            cursor: 'pointer'
                        }}
                        onClick={ctx.handleRefreshValidateImg}
                    />
                </div>
                }
            </div>
            {ctx.state.loginLoading? 
                <Spin/>
                :
                <div className="m-btn" onClick={ctx.enter}>
                    点击进入
                </div>
            }
        </div>
    );
};

class Welcome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userInfo: {
                username: '',
                password: ''
            },
            imageLoading: false,
            clicks: []
        };
        this.enter = this.enter.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleImageClick = this.handleImageClick.bind(this);
        this.handleRefreshValidateImg = this.handleRefreshValidateImg.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.showLogin = this.showLogin.bind(this);
        this.closeWelcome = this.closeWelcome.bind(this)

        setPassport();
        this.setCaptchaImg();
    }
    closeWelcome(){
        this.props.closeWelcome();
    }
    setCaptchaImg(){
        this.setState({
            imageLoading: true
        });
        getCaptchaImg().then(res => {
            this.setState({
                imageUrl: res.image,
                imageLoading: false
            });
        });
    }
    showLogin(){
        this.props.changeError({
            readyForLogin: true
        });
    }
    handleLogout(){
        logout();
        this.showLogin();
    }
    handleRefreshValidateImg(){
        this.setCaptchaImg();
        this.emptyClicks();
    }
    handleImageClick(e){
        const image = document.querySelector('#captcha-image');
        let clientRect = image.getBoundingClientRect();

        let x = e.clientX - clientRect.left;
        let y = e.clientY - clientRect.top
        
        let clicks = this.state.clicks;
        clicks.push({x, y});

        this.setState({
            clicks
        });
    }
    handleInput(key){
        return (e) => {
            let value = e.target.value.trim();
            let userInfo = {};
            userInfo[key] = value;
            userInfo = Object.assign(this.state.userInfo, userInfo);

            this.setState({
                userInfo
            });
        }
    }
    validate(){
        const { userInfo } = this.state;

        if(!userInfo.username){
            return {success: false, message: '用户名不能为空'};
        }

        if(!userInfo.password){
            return {success: false, message: '密码不能为空'};
        }

        return {success: true};
    }
    emptyClicks(){
        this.setState({
            clicks: []
        });
    }
    login(){
        let { userInfo, answer } = this.state;
        let { username, password } = userInfo;

        this.setState({
            loginLoading: true
        });
        login({username, password, answer}).then(res => {
            if(res.data.result_code == 0){
                message.success(res.data.result_message);
                isLogined().then(res => {
                    this.props.closeWelcome(res);
                });
            }else{
                message.error(res.data.result_message);
                this.setState({
                    loginLoading: false
                });
            }
        });
    }
    enter(){
        const { userInfo, clicks } = this.state;
        let validateRes = this.validate();
        if(!validateRes.success){
            message.error(validateRes.message);
            return;
        }
        let answer = clicks.map(click => `${parseInt(click.x)},${parseInt(click.y)}`).join(',');
        this.state.answer = answer;

        this.setState({
            loginLoading: true
        });
        validateCaptchaImg(answer).then(res => {
            if(res.result_code === '4'){
                message.loading('验证成功', 1);
                this.login()

            }else{
                message.error('验证码验证失败');
                this.emptyClicks()
                this.setCaptchaImg();
            }
            this.setState({
                loginLoading: false
            });
        });
    }
    render(){
        let { error, welcomeLoading, isLogined } = this.props;
        return (
            <div className="m-welcome-wraper">
                <h1 className="m-title">
                    欢迎来到<br/>
                    <p className="u-name">TICKET</p>
                    {!welcomeLoading && ((error && error.readyForLogin) || (!error && !isLogined)) && Login(this)}
                    {!welcomeLoading && error && !error.readyForLogin && ErrorInfo({error, ctx: this})}
                    {welcomeLoading && WelcomeLoading()}
                    {!welcomeLoading && !error && isLogined && UserInfo(this)}
                </h1>
            </div>
        );
    }
}

export default Welcome;