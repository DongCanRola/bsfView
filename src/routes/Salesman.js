/**
 * Created by dongc_000 on 2018/4/30.
 */
import React from 'react';
import screenfull from 'screenfull';
import { Menu, Icon, Card, Tooltip,Row,Col,Layout,Breadcrumb,Badge} from 'antd';
import {Link} from 'react-router';
import { browserHistory } from 'dva/router'
import HeaderInfo from '../components/util/HeaderInfo';

const { Header,Sider,Content, Footer } = Layout;
const MenuItemGroup = Menu.ItemGroup;

const SubMenu = Menu.SubMenu;

const Salesman =React.createClass({

  getInitialState(){
    return {
      collapsed: false,
      mode: 'inline',
      user: ''
    }
  },

  onCollapse(collapsed){
    console.log(collapsed);
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  },

  screenFull(){
    if (screenfull.enabled) {
      screenfull.request();
    }

  },
  render(){
    return (
      <Layout>
        <Header className="header" style={{ lineHeight: '44px' }}>
          <HeaderInfo role="销售"/>
        </Header>


        <Layout style={{ height: '90vh' }}>
          <Sider  collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>

            <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={['6']}>
              <Menu.Item key="index">
                <Link to="index"><Icon type="mobile" /><span className="nav-text">首页</span></Link>
              </Menu.Item>

              <SubMenu
                key="contract"
                title={<span><Icon type="scan" /><span className="nav-text">销售管理</span></span>}
              >
                <Menu.Item key="saleCustomer"><Link to="/saleCustomerManagement">客户管理</Link></Menu.Item>
                <Menu.Item key="saleOrders"><Link to="/saleOrderManagement">订单管理</Link></Menu.Item>
              </SubMenu>

            </Menu>
          </Sider>

          <Layout>
            <Content style={{ background: '#FCFCFC', padding: 0, margin: 0, minHeight: 480 }}>
              {this.props.children}
            </Content>
            <Footer style={{textAlign: 'center'}}>
              加工进销存 ©2018 Created by test
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
});

export  default Salesman;
