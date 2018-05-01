/**
 * Created by dongc_000 on 2018/4/30.
 */
import React from 'react';
import {Card, Button, Table, Form, Modal, Input, Select, message} from 'antd';

import {userColumn} from './adminTable';
import {getUsers, addUser} from '../../services/api';

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

export default class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      userColumn: userColumn(),
      userData: [],

      loadUser: true,
      addVisible:false,
      modifyVisible:false
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

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed:",selectedRowKeys);
    this.setState({selectedRowKeys});
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
      onChange: this.onSelectChange.bind(this),
      type:'radio'
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
                this.setState({modifyVisible:true});
              }
            }
          >
            修改用户身份
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
        </div>
      </Card>
    )
  }
}

module.export = UserManagement;
