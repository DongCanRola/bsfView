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

const WarehouseKeeper =React.createClass({

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
          <HeaderInfo role="库管"/>
        </Header>


        <Layout style={{ height: '90vh' }}>
          <Sider  collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>

            <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={['6']}>
              <Menu.Item key="index">
                <Link to="index"><Icon type="mobile" /><span className="nav-text">首页</span></Link>
              </Menu.Item>

              <SubMenu
                key="contract"
                title={<span><Icon type="scan" /><span className="nav-text">库存管理</span></span>}
              >

                  <Menu.Item key="warehouseManagement"><Link to="/warehouseManagement">仓库管理</Link></Menu.Item>
                  <Menu.Item key="lookGoodsStock"><Link to="/lookGoodsStock">货物库存</Link></Menu.Item>

              </SubMenu>

              <SubMenu
                key="store"
                title={<span><Icon type="scan" /><span className="nav-text">入库管理</span></span>}
              >
                <Menu.Item key="purchaseStore"><Link to="/purchaseStore">进货入库</Link></Menu.Item>
                <Menu.Item key="productStore"><Link>成品入库</Link></Menu.Item>
              </SubMenu>

              <SubMenu
                key="fetch"
                title={<span><Icon type="scan" /><span className="nav-text">出库管理</span></span>}
              >
                <Menu.Item key="materialFetch"><Link to="/materialFetchManagement">加工出库</Link></Menu.Item>
                <Menu.Item key="productSend"><Link>成品发货</Link></Menu.Item>
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

export  default WarehouseKeeper;
