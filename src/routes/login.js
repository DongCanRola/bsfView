/**
 * Created by dongc_000 on 2018/4/28.
 */
import React from 'react';
import {Form, Icon, Input, Button, Card, Checkbox, message} from 'antd';
import {login} from '../services/api'

const FormItem = Form.Item;

const Login = Form.create()(React.createClass({
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        console.log('Received values of form:', values);
        //console.log('user:',values.userName);
        //console.log('password:',values.password);
        login(values.userName, values.password).then(resp => {
          console.log(resp.data);
          if(resp.data.entity.result === 'ok') {
            message.success("connect successfully!");
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
}));

export default Login
