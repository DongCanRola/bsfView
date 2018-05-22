/**
 * Created by dongc_000 on 2018/4/28.
 */
import React from 'react';
import {Form, Icon, Input, Button, Card, Checkbox, message, Menu, Dropdown, Select} from 'antd';
import {browserHistory} from 'dva/router';
import md5 from 'js-md5';

import {login} from '../services/api';
import {getPath} from './RouterHash';

const FormItem = Form.Item;
const Option = Select.Option;

const Login = Form.create()(React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log('Received values of form:', values);
        let username = values.userName;
        let password = md5(values.password);
        let role = values.role;
        login(username, password, role).then(resp => {
          console.log(resp.data);
          if(resp.data.entity.result === 'ok') {
            //console.log("id:",resp.data.entity.data.user_id);
            //console.log("name:",resp.data.entity.data.user_name);
            //console.log("role",resp.data.entity.data.user_roles);
            let realName = resp.data.entity.data.user_name;
            let path = getPath(role);
            if(path !== null) {
              window.sessionStorage.setItem("userId",username);
              window.sessionStorage.setItem("realName",resp.data.entity.data.user_name);
              window.sessionStorage.setItem("allRoles",resp.data.entity.data.user_roles);
              window.sessionStorage.setItem("currentRole",role);
              console.log("roles", resp.data.entity.data.user_roles);
              browserHistory.push(path);
              message.success(realName+"，欢迎登录！", 4);
            }

          } else {
            message.warning("登录失败！",4);
          }
        })
      }
    });
  },
  render() {
    const { getFieldDecorator } = this.props.form;
    return(
      <div style={{background: '#FCFCFC', height: document.body.clientHeight, padding: '6% 0',font: 'Open Sans'}}>
        <Card bordered='false' title='用户登录'style={{background: '#E6E6FA',width:400,margin:'0 auto',marginTop:30,paddingLeft:50,paddingRight:50,paddingTop:30}}>
          <span style={{fontSize:'18px',textAlign:'center',margin:'0 auto',width:100,paddingLeft:30,paddingRight:10,paddingTop:0}}></span>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input size="large" addonBefore={<Icon type="user" />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input size="large" addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('role', {
                rules: [{required: true, message:'请选择登录身份！'}],
              })(
                <Select placeholder="please choose your role">
                  <Option value="2">管理员</Option>
                  <Option value="3">销售</Option>
                  <Option value="4">进货</Option>
                  <Option value="5">仓库</Option>
                  <Option value="6">加工</Option>
                  <Option value="7">财务</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              <Button style={{width:250}} type="primary" htmlType="submit" onClick={this.handleSubmit}>登录</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}));

export default Login
