/**
 * Created by LynnGhl on 2017/5/13.
 */

import React from 'react'
import { Form, Icon, Input, Button, Checkbox, Card, message} from 'antd';
import { browserHistory } from 'dva/router'
import md5 from 'js-md5'
import { signin, getToken} from './auth'
import { getPath } from "../../routes/RouterHash";

const FormItem = Form.Item;

const Login = Form.create()(React.createClass({

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        signin({
            employeeid:values.userName,
            password:md5(values.password),
            agreement:values.remember
          },(resp) => {
            if (resp.data.result == 'ok'){
              let path = getPath(resp.data.data.position);//根据职位获取路径
              if(path == null){
                message.warning("用户名或者密码错误，请重试！", 4)
              } else {
                window.sessionStorage.setItem("position", resp.data.data.position);
                message.success("登陆成功，欢迎" + values.userName, 4);
                browserHistory.push(path);
              }
            } else {
              message.warning("用户名或者密码错误，请重试！", 4);
            }
          });

        /*
        getToken({
          employeeid:values.userName,
          password:md5(values.password)
        });*/

      } else {
        alert("请求失败-----")
      }
    });
  },

  render(){
    const { getFieldDecorator } = this.props.form;
    return(
      <div style={{background: '#4A374A', height: document.body.clientHeight, padding: '6% 0',font: 'Open Sans'}}>
        <Card bordered='false' title='用户登录'style={{background: '#6c506c',width:400,margin:'0 auto',marginTop:30,paddingLeft:50,paddingRight:50,paddingTop:30}}>
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
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox style={{marginRight:110}}>记住我</Checkbox>
              )}
              <Button type="primary" htmlType="submit">登陆</Button>

            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}))

export default Login
