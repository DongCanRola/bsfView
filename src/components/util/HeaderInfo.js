import React from 'react';
import {Menu, Icon, Input, Modal, message, Form} from 'antd';
import screenfull from 'screenfull';
import {browserHistory} from 'dva/router'
import md5 from 'js-md5'
import {modifyPassword} from "../../services/adminApi";

const MenuItemGroup = Menu.ItemGroup;

const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;

var HeaderInfo = React.createClass({
  getDefaultProps: function () {
    return {
      role: '销售员'
    };
  },

  getInitialState: function () {
    return {
      userName: window.sessionStorage.getItem("userName"),
      userId: window.sessionStorage.getItem("employeeId"),
      position:window.sessionStorage.getItem("position"),
      password: '',
      oldPassword: '',
      passwordConfirm: '',
      modifyPassword: false
    };
  },

  changePassword: function () {
    console.log("点击修改密码。");

    if (this.state.password == null || this.state.password == '') {
      message.warning("请输入要修改的密码！", 2);
      return;
    }

    if (this.state.passwordConfirm != this.state.password) {
      message.warning("密码不一致，请重新输入！", 2);
      return;
    }


    if (md5(this.state.oldPassword) != window.sessionStorage.getItem("password")) {
      console.log("y原密码加密后：",md5(this.state.oldPassword));
      console.log("原来的md5密码：",window.sessionStorage.getItem("password"))
      message.warning("原密码不对，请确认您拥有权限！", 2);
      return;
    }

    modifyPassword(this.state.userId, this.state.password).then(resp => {
      console.log("返回的数据：", resp);
      if (resp.data) {
        message.success("修改密码成功,请您重新登录！", 2);
        this.setState({modifyPassword: false});
        this.logout();
      }
    }).catch(err => {
      console.log(" 修改密码发生错误：", err)
    })

  },

  logout: function () {
    console.log("点击退出登录");
    window.sessionStorage.removeItem("token");
    browserHistory.push("/login");
  },

  screenFull(){
    if (screenfull.enabled) {
      screenfull.request();
    }

  },

  propTypes: {
    role: React.PropTypes.string.isRequired,
  },


  render() {
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 60},
        sm: {span: 14},
      },
    };
    return (
      <div className="header" style={{lineHeight: '44px'}}>

        <div className="logo"/>
        <span><i className="on bottom b-white"/><Icon type="windows"/>这里放logo</span>

        <Menu theme="dark" mode="horizontal" style={{lineHeight: '64px', float: 'right'}}>
          <Menu.Item key="full" onClick={this.screenFull}>
            <Icon type="arrows-alt" onClick={this.screenFull}/>
          </Menu.Item>

          <Menu.Item key="1">
            {/*<Badge count={25} overflowCount={2} style={{marginLeft: 10}}>*/}
            {/*<Icon type="notification" />*/}
            {/*</Badge>*/}
            <span style={{width: 60, marginRight: 10}}> {this.state.position}</span>
            <span>|</span>
            <span style={{width: 80, marginLeft: 10}}> {this.state.userName} ，欢迎你 </span>
          </Menu.Item>


          <SubMenu title={<span><i className="on bottom b-white"/>  信息设置<Icon type="setting"/></span>}>

            <MenuItemGroup title="用户中心">
              <Menu.Item key="setting:2">个人信息</Menu.Item>
            </MenuItemGroup>

            <MenuItemGroup title="设置中心">
              <Menu.Item key="setting:3">
                   <span onClick={() => {
                     this.setState({
                       modifyPassword: true
                     });
                   }}>设置密码</span>
              </Menu.Item>
              {/*<Menu.Item key="setting:4">系统设置</Menu.Item>*/}
            </MenuItemGroup>
          </SubMenu>

          <Menu.Item key="logout">
            <Icon type="logout" onClick={this.logout}/>
            <span onClick={() => {
              this.logout();
            }}>退出登录</span>
          </Menu.Item>

        </Menu>
        <style>{`
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>


        <Modal title="修改密码"
               key="modifyPassword"
               width={420}
               visible={this.state.modifyPassword}
               okText={"确定"}
               cancelText={"取消"}
               onOk={() => {
                 this.changePassword();
               }}
               onCancel={() => {
                 this.setState({modifyPassword: false});
               }}>

          <div style={{width: 400}}>

            <FormItem
              label="原密码"
              {...formItemLayout}
            >
              <Input defaultValue={this.state.oldPassword}
                     type={"password"}
                     onChange={(e) => {
                       this.state.oldPassword = e.target.value;
                     }}
              />
            </FormItem>


            <FormItem
              label="密码"
              {...formItemLayout}
            >
              <Input defaultValue={this.state.password}
                     type={"password"}
                     onChange={(e) => {
                       this.state.password = e.target.value;

                     }}
              />
            </FormItem>
            <FormItem
              label="密码确认"
              {...formItemLayout}
            >
              <Input
                defaultValue={this.state.passwordConfirm}
                type={"password"}
                onChange={(e) => {
                  this.state.passwordConfirm = e.target.value;
                }}

              />
            </FormItem>

          </div>

        </Modal>

      </div>
    )
  }
});

export default HeaderInfo;

