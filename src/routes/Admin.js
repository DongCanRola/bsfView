/**
 * Created by lenovo on 2017/5/18.
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

const Admin =React.createClass({

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
  logout(){
    window.localStorage.removeItem("employeeId");
    browserHistory.push("/login");
  },
  render(){
    return (
      <Layout>
        <Header className="header" style={{ lineHeight: '44px' }}>

          {/*<div className="logo" /><span><i className="on bottom b-white" /><Icon type="windows" />这里放logo</span>*/}


          {/*<Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px', float: 'right' }}>*/}
            {/*<Menu.Item key="full" onClick={this.screenFull} >*/}
              {/*<Icon type="arrows-alt" onClick={this.screenFull} />*/}
            {/*</Menu.Item>*/}


            {/*<Menu.Item key="1">*/}
              {/*<Badge count={25} overflowCount={2} style={{marginLeft: 10}}>*/}
                {/*<Icon type="notification" />*/}
              {/*</Badge>*/}
            {/*</Menu.Item>*/}


            {/*<SubMenu title={<span><i className="on bottom b-white" />{window.localStorage.getItem("employeeId")} <Icon type="idcard" /></span>}>*/}

              {/*<MenuItemGroup title="用户中心">*/}
                {/*<Menu.Item key="setting:1">你好 - Admin</Menu.Item>*/}
                {/*<Menu.Item key="setting:2">个人信息</Menu.Item>*/}
              {/*</MenuItemGroup>*/}

              {/*<MenuItemGroup title="设置中心">*/}
                {/*<Menu.Item key="setting:3">个人设置</Menu.Item>*/}
                {/*<Menu.Item key="setting:4">系统设置</Menu.Item>*/}
              {/*</MenuItemGroup>*/}
            {/*</SubMenu>*/}
            {/*<Menu.Item key="logout" onClick={this.logout}><Icon type="logout" onClick={this.logout} />退出登录</Menu.Item>*/}

          {/*</Menu>*/}
          {/*<style>{`*/}
                    {/*.ant-menu-submenu-horizontal > .ant-menu {*/}
                        {/*width: 120px;*/}
                        {/*left: -40px;*/}
                    {/*}*/}
                {/*`}</style>*/}
          <HeaderInfo role=" 管理员"/>
        </Header>


        <Layout style={{ height: '90vh' }}>
          <Sider  collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>

            <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={['6']}>
              <Menu.Item key="index">
                <Link to="index"><Icon type="mobile" /><span className="nav-text">首页</span></Link>
              </Menu.Item>

              <SubMenu
                key="contract"
                title={<span><Icon type="scan" /><span className="nav-text">人员管理</span></span>}
              >
                <Menu.Item key="employee"><Link to="employeeManagement">员工管理</Link></Menu.Item>
              </SubMenu>

              <SubMenu
                key="scanner"
                title={<span><Icon type="scan" /><span className="nav-text">扫描枪管理</span></span>}
              >
                <Menu.Item key="scannerlist"><Link to="scannerList">查看</Link></Menu.Item>
              </SubMenu>

              <SubMenu
                key="scanfunction"
                title={<span><Icon type="scan" /><span className="nav-text">扫描功能管理</span></span>}
              >
                <Menu.Item key="scanfunctionlist"><Link to="scanFunctionList">扫描功能</Link></Menu.Item>
                <Menu.Item key="scanmodulelist"><Link to="scanModuleList">扫描模式</Link></Menu.Item>
              </SubMenu>

              <SubMenu
                key="barcodetype"
                title={<span><Icon type="scan" /><span className="nav-text">条形码管理</span></span>}
              >
                <Menu.Item key="barcodetypelist"><Link to="barcodeTypeList">查看</Link></Menu.Item>
              </SubMenu>

              <SubMenu
                key="equipmentManager"
                title={<span><Icon type="scan" /><span className="nav-text">设备管理</span></span>}
              >
                <Menu.Item key="equipment"><Link to="equipment">查看</Link></Menu.Item>
                <Menu.Item key="equipmentmonitor"><Link to="equipmentmonitor">设备绑定的监视器</Link></Menu.Item>
              </SubMenu>

              <SubMenu
                key="monitor"
                title={<span><Icon type="scan" /><span className="nav-text">监控管理</span></span>}
              >
                <Menu.Item key="monitorlist"><Link to="monitorList">监控器</Link></Menu.Item>
                <Menu.Item key="plotchart"><Link to="plotchartList">折线图</Link></Menu.Item>
              </SubMenu>

              <SubMenu
                key="craft"
                title={<span><Icon type="scan" /><span className="nav-text">工艺管理</span></span>}
              >
                <Menu.Item key="crafttypem"><Link to="crafttypeManagement">工艺类型管理</Link></Menu.Item>
              </SubMenu>
              <SubMenu
                key="dyeWarehouses"
                title={<span><Icon type="scan" /><span className="nav-text">染料仓库</span></span>}
              >
                <Menu.Item key="dye"><Link to="approveSupplier">审批供应商</Link></Menu.Item>
                <Menu.Item key="dyes"><Link to="approveDyestuffcategory">审批化学品种类</Link></Menu.Item>
                <Menu.Item key="dyem"><Link to="approveDyestuffmodel">审批染化料种类</Link></Menu.Item>
              </SubMenu>

            </Menu>
          </Sider>

          <Layout>
            <Content style={{ background: '#d6d6d6', padding: 0, margin: 0, minHeight: 480 }}>
              {this.props.children}
            </Content>
            <Footer style={{textAlign: 'center'}}>
              龙泉印染厂管理系统 ©2017 Created by 不会写前端的LoLer不是好程序猿
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }




});


export  default Admin;
