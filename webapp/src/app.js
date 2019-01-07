import React from 'react';
import { Layout, Divider, Spin, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import AdvancedSearchContent from './content';
import Welcome from './welcome';
import isLogined from './utils/isLogined';
import logout from './utils/logout';
const {
    Header, Footer, Content,
} = Layout;



class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showWelcome: true,
            showContent: false,
            welcomeLoading: true,
            username: '',
            error: false,
            loading: true
        };
        this.closeWelcome = this.closeWelcome.bind(this);
        this.changeError = this.changeError.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        isLogined().then(username => {
            this.setState({
                welcomeLoading: false,
                username,
                isLogined: true,
                loading: false
            });
        }).catch((error) => {
            this.setState({
                error,
                welcomeLoading: false,
                isLogined: false,
                loading: false
            })
        });
    }
    closeWelcome(username){
        this.setState({
            showWelcome: false,
            showContent: true,
            username: username || this.state.username
        });
    }
    changeError(error){
        const state = this.state;
        this.setState({
            error: Object.assign({}, state.error, error)
        });
    }
    handleLogout(){
        logout();
        this.setState({
            showWelcome: true,
            showContent: false,
            isLogined: false
        });
    }
    render(){
        let { loading } = this.state;
        return (
            <div className="m-app">
                {
                    loading && <Spin className="m-app-loading" type="large"/>
                }
                {
                    !loading && 
                    this.state.showWelcome 
                    &&
                    <Welcome
                        key="welcome"
                        error={this.state.error}
                        isLogined={this.state.isLogined}
                        username={this.state.username}
                        welcomeLoading={this.state.welcomeLoading} 
                        closeWelcome={this.closeWelcome}
                        changeError={this.changeError}
                    />
                }
                {
                    !loading && 
                    this.state.showContent 
                    &&
                    <Layout className="m-page-view">
                        <Header className="m-header">
                            TICKET
                            <div className="m-user-meta">
                                当前用户：{this.state.username}
                                <a onClick={this.handleLogout}> 退出</a>
                            </div>
                        </Header>
                        <Content className="m-content">
                            <AdvancedSearchContent></AdvancedSearchContent>
                        </Content>
                        <Footer></Footer>
                    </Layout>
                }
            </div>
        );
    }
}

export default App;