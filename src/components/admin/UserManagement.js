/**
 * Created by dongc_000 on 2018/4/30.
 */
import React from 'react';
import {Card, Button, Table, Form, Modal, Input, Select, message} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {userColumn} from './adminTable';
import {getUsers, addUser, updateUserMessage} from '../../services/api';

const Option = Select.Option;

const FormItem = Form.Item;
const UserForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="新增用户"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="姓名">
            {getFieldDecorator('newName',{
              rules: [{ required:true, message: '请输入用户姓名！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="电话">
            {getFieldDecorator('newPhone', {
              rules: [{ required: true, message: '请输入用户电话号码！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="QQ">
            {getFieldDecorator('newQq')(<Input/>)}
          </FormItem>
          <FormItem label="微信">
            {getFieldDecorator('newWechat')(<Input/>)}
          </FormItem>
          <FormItem label="邮箱">
            {getFieldDecorator('newEmail')(<Input/>)}
          </FormItem>
          <FormItem label="初始职务">
            {getFieldDecorator('iniPosition',{
              rules: [{required:true, message: "请设定初始职务！"}],
            })(
              <Select>
                <Option value="2">管理员</Option>
                <Option value="3">销售</Option>
                <Option value="4">进货</Option>
                <Option value="5">库管</Option>
                <Option value="6">生产加工</Option>
                <Option value="7">财务</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

const UpdateUserForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="更改信息"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="电话">
            {getFieldDecorator('updatePhone', {
              initialValue: window.sessionStorage.getItem("user_before_phone"),
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="QQ">
            {getFieldDecorator('updateQq', {
              initialValue: window.sessionStorage.getItem("user_before_qq"),
            })(<Input/>)}
          </FormItem>
          <FormItem label="微信">
            {getFieldDecorator('updateWechat', {
              initialValue: window.sessionStorage.getItem("user_before_wechat"),
            })(<Input/>)}
          </FormItem>
          <FormItem label="邮箱">
            {getFieldDecorator('updateEmail', {
              initialValue: window.sessionStorage.getItem("user_before_email"),
            })(<Input/>)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

export default class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      userColumn: userColumn(),
      userData: [],

      loadUser: true,
      addVisible:false,
      //modifyVisible:false,

      updateMessageVisible: false
    };
    this.setData();
  }

  setData() {
    getUsers().then((resp) => {
      let v =[];
      console.log(resp.data.entity);
      for(let item of resp.data.entity) {
        v.push({
          key: item.user_id,
          userId: item.user_id,
          userName: item.user_name,
          phone: item.phone,
          qq_number: item.qqnumber,
          wechat: item.wechat,
          email: item.email,
          roles: item.user_roles
        });
      }
      this.setState({
        userData: v,
        loadUser: false
      });
      console.log(v);
    }).catch(() => {});
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    console.log("selectedRowKeys changed:",selectedRowKeys);
    console.log("selectedRows changed: ", selectedRows);
    this.setState({selectedRowKeys, selectedRows});
  }

  saveFormRef = (form) => {
    this.form = form;
  };

  handleAddCancel = () => {
    this.setState({addVisible: false});
  };

  handleAddCreate = () => {
    const form = this.form;
    form.validateFields((err,values) => {
      if(err) {
        return;
      }
      var obj = {
        user_name: values.newName,
        phone: values.newPhone,
        qqnumber: values.newQq,
        wechat: values.newWechat,
        email: values.newEmail,
        user_roles: [values.iniPosition]
      };
      //console.log("new user:",obj);
      addUser(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("添加成功，新用户ID为"+resp.data.entity.message, 5);
          this.setData();
          this.setState({addVisible: false});
        }
      }).catch(() => {
        message.warning("添加失败！");
      });
    })
  };

  messageUpdate() {
    let users = this.state.selectedRows;
    if(users.length !== 1) {
      message.warning("请选择一个用户！", 2);
    } else {
      window.sessionStorage.setItem("user_before_phone", users[0].phone);
      window.sessionStorage.setItem("user_before_qq", users[0].qq_number);
      window.sessionStorage.setItem("user_before_wechat", users[0].wechat);
      window.sessionStorage.setItem("user_before_email", users[0].email);
      this.updateForm.resetFields();
      this.setState({updateMessageVisible: true});
    }
  }
  saveUpdateFormRef = (form) => {
    this.updateForm = form;
  };
  handleUpdateCancel = () => {
    this.setState({updateMessageVisible: false});
    window.sessionStorage.removeItem("user_before_phone");
    window.sessionStorage.removeItem("user_before_qq");
    window.sessionStorage.removeItem("user_before_wechat");
    window.sessionStorage.removeItem("user_before_email");
  };
  handleUpdateCreate = () => {
    const form = this.updateForm;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      let obj = {
        user_id: this.state.selectedRows[0].userId,
        user_name: this.state.selectedRows[0].userName,
        phone: values.updatePhone,
        qqnumber: values.updateQq,
        wechat: values.updateWechat,
        email: values.updateEmail,
        user_roles: [values.updatePosition]
      };
      console.log("user to update：", obj);
      updateUserMessage(obj).then(resp => {
        console.log("update user message result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("成功更新用户信息！", 2);
          this.setData();
          this.setState({updateMessageVisible:false});
          window.sessionStorage.removeItem("user_before_phone");
          window.sessionStorage.removeItem("user_before_qq");
          window.sessionStorage.removeItem("user_before_wechat");
          window.sessionStorage.removeItem("user_before_email");
        } else {
          message.warning("更新用户信息失败！", 2);
        }
      }).catch(() => {
        message.warning("更新失败！", 2);
      })
    })
  };

  changeRoles() {
    let users = this.state.selectedRows;
    if(users.length !== 1) {
      message.warning("请选择一个用户！", 2);
    } else {
      window.sessionStorage.setItem("user_modify_role_id", users[0].userId);
      browserHistory.push({pathname: '/userRoleManagement'});
    }
  }

  render() {
    const pagination = {
      total: this.state.userData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    const {selectedRowKeys} = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    };

    return (
      <Card title="用户列表"
      extra={
        <div>
          <Button
            style={{width: 120, marginRight: 5, marginLeft: 10}}
            onClick={
              () => {
                this.setState({addVisible:true});
              }
            }
          >
            添加用户
          </Button>
          <Button
            style={{width: 120, marginRight: 5, marginLeft: 10}}
            onClick={
              () => {
                //this.setState({modifyVisible:true});
                this.messageUpdate();
              }
            }
          >
            修改用户信息
          </Button>
          <Button
            style={{width: 120, marginRight: 5, marginLeft: 10}}
            onClick={
              () => {
                this.changeRoles();
              }
            }
          >
            修改用户职责
          </Button>
        </div>
      }>
        <Table
          rowSelection={rowSelection}
          columns={this.state.userColumn}
          dataSource={this.state.userData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadUser}
          rowKey={"userId"}
        />
        <div>
          <UserForm
            ref={this.saveFormRef}
            visible={this.state.addVisible}
            onCancel={this.handleAddCancel}
            onCreate={this.handleAddCreate}
          />
          <UpdateUserForm
            ref={this.saveUpdateFormRef}
            visible={this.state.updateMessageVisible}
            onCancel={this.handleUpdateCancel}
            onCreate={this.handleUpdateCreate}
          />
        </div>
      </Card>
    )
  }
}

module.export = UserManagement;
