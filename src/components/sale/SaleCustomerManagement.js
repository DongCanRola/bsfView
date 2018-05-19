/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Button, Table, Form, Modal, Input, Select, message, Collapse} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {customerColumn} from './saleTable';
import {getCustomer, addCustomer, updateCustomer} from '../../services/customerApi';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

const FormItem = Form.Item;
const CustomerForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="新增客户"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="名称">
            {getFieldDecorator('newCustomerName',{
              rules: [{ required:true, message: '请输入客户名称！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="负责人">
            {getFieldDecorator('newCustomerManager',{
              rules: [{ required:true, message: '请输入客户负责人！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="电话">
            {getFieldDecorator('newCustomerPhone', {
              rules: [{ required: true, message: '请输入客户电话号码！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="邮箱">
            {getFieldDecorator('newCustomerEmail')(<Input/>)}
          </FormItem>
          <FormItem label="地址">
            {getFieldDecorator('newCustomerAddress',{
              rules: [{required:true, message: "请输入客户地址！"}],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

const CustomerUpdateForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="更新客户信息"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="名称">
            {getFieldDecorator('updateCustomerName',{
              initialValue: window.sessionStorage.getItem("customer_before_name"),
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="负责人">
            {getFieldDecorator('updateCustomerManager',{
              initialValue: window.sessionStorage.getItem("customer_before_manager"),
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="电话">
            {getFieldDecorator('updateCustomerPhone', {
              initialValue: window.sessionStorage.getItem("customer_before_telephone"),
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="邮箱">
            {getFieldDecorator('updateCustomerEmail', {
              initialValue: window.sessionStorage.getItem("customer_before_email"),
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="地址">
            {getFieldDecorator('updateCustomerAddress',{
              initialValue: window.sessionStorage.getItem("customer_before_address"),
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

const AgentForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="新增销售代理"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="名称">
            {getFieldDecorator('newAgentName',{
              rules: [{ required:true, message: '请输入代理名称！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="负责人">
            {getFieldDecorator('newAgentManager',{
              rules: [{ required:true, message: '请输入代理负责人！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="电话">
            {getFieldDecorator('newAgentPhone', {
              rules: [{ required: true, message: '请输入代理电话号码！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="邮箱">
            {getFieldDecorator('newAgentEmail')(<Input/>)}
          </FormItem>
          <FormItem label="地址">
            {getFieldDecorator('newAgentAddress',{
              rules: [{required:true, message: "请输入代理地址！"}],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

export default class SaleCustomerManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerData: [],
      agentData: [],
      selectedCustomerRowKeys: [],
      selectedCustomerRows: [],
      selectedAgentRowKeys: [],
      column: customerColumn(),
      chooseCustomer: window.sessionStorage.getItem("order_product") !== null ? 'inline':'none',

      customerVisible: false,
      agentVisible: false,
      loadCustomer: true,
      loadAgent: true,

      updateCustomerVisible: false
    };
    this.setData("2");
    this.setData("3");
  }

  setData(type) {
    let kind = type;
    getCustomer(type).then(resp => {
      console.log(resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          customerId: item.id,
          customerType: item.type,
          customerName: item.name,
          customerManager: item.manager,
          customerTelephone: item.telephone,
          customerEmail: item.email,
          customerAddress: item.address
        });
      }
      if(kind === "2") {
        this.setState({
          customerData: v,
          loadCustomer: false
        });
      }
      if(kind === "3") {
        this.setState({
          agentData: v,
          loadAgent: false
        });
      }
    }).catch();
  }

  onSelectChangeCustomer(selectedCustomerRowKeys, selectedCustomerRows) {
    console.log("selectedCustomerRowKeys changed: ", selectedCustomerRowKeys);
    console.log("selectedCustomerRows changed: ", selectedCustomerRows);
    this.setState({selectedCustomerRowKeys, selectedCustomerRows});
  }

  onSelectChangeAgent(selectedAgentRowKeys) {
    console.log("selectedAgentRowKeys changed: ", selectedAgentRowKeys);
    this.setState({selectedAgentRowKeys});
  }

  saveCustomerFormRef = (form) => {
    this.formCustomer = form;
  };
  saveAgentFormRef = (form) => {
    this.formAgent = form;
  };
  handleCustomerCancel = () => {
    this.setState({customerVisible: false});
  };
  handleAgentCancel = () => {
    this.setState({agentVisible: false});
  };
  handleCustomerCreate = () => {
    const form = this.formCustomer;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      var obj = {
        name: values.newCustomerName,
        type: "2",
        manager: values.newCustomerManager,
        telephone: values.newCustomerPhone,
        email: values.newCustomerEmail,
        address: values.newCustomerAddress
      };
      console.log("new customer: ", obj);
      addCustomer(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("添加成功，新客户ID为"+resp.data.entity.message, 5);
          this.setData("2");
          this.setState({customerVisible: false});
        }
      }).catch(() => {
        message.warning("添加失败！");
      });
    })
  };
  handleAgentCreate = () => {
    const form = this.formAgent;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      var obj = {
        name: values.newAgentName,
        type: "3",
        manager: values.newAgentManager,
        telephone: values.newAgentPhone,
        email: values.newAgentEmail,
        address: values.newAgentAddress
      };
      console.log("new agent: ", obj);
      addCustomer(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("添加成功，新代理ID为"+resp.data.entity.message, 5);
          this.setData("3");
          this.setState({agentVisible: false});
        }
      }).catch(() => {
        message.warning("添加失败！");
      });
    })
  };

  customerNext() {
    let chooseCustomer = this.state.selectedCustomerRowKeys;
    if(chooseCustomer.length !== 1) {
      message.warning("请选择订单客户！", 2);
    } else {
      window.sessionStorage.setItem("order_consumer", chooseCustomer[0]);
      browserHistory.push({pathname: '/planOrderManagement'});
    }
  }

  updateCustomerSale() {
    let customer = this.state.selectedCustomerRows;
    if(customer.length !== 1) {
      message.warning("请选择一个用户！", 2);
    } else {
      window.sessionStorage.setItem("customer_before_name", customer[0].customerName);
      window.sessionStorage.setItem("customer_before_manager", customer[0].customerManager);
      window.sessionStorage.setItem("customer_before_telephone", customer[0].customerTelephone);
      window.sessionStorage.setItem("customer_before_email", customer[0].customerEmail);
      window.sessionStorage.setItem("customer_before_address", customer[0].customerAddress);
      this.setState({updateCustomerVisible: true});
    }
  }

  saveCustomerUpdateFormRef = (form) =>{
    this.formCustomerUpdate = form;
  };
  handleCustomerUpdateCancel = () => {
    this.setState({updateCustomerVisible: false});
    window.sessionStorage.removeItem("customer_before_name");
    window.sessionStorage.removeItem("customer_before_manager");
    window.sessionStorage.removeItem("customer_before_telephone");
    window.sessionStorage.removeItem("customer_before_email");
    window.sessionStorage.removeItem("customer_before_address");
  };
  handleCustomerUpdateCreate = () => {
    const form = this.formCustomerUpdate;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      let obj = {
        id: this.state.selectedCustomerRows[0].customerId,
        name: values.updateCustomerName,
        type: "2",
        manager: values.updateCustomerManager,
        telephone: values.updateCustomerPhone,
        email: values.updateCustomerEmail,
        address: values.updateCustomerAddress
      };
      console.log("update customer: ", obj);
      updateCustomer(obj).then(resp => {
        console.log("update sale customer result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("成功更新客户信息！", 2);
          this.setState({updateCustomerVisible: false});
          window.sessionStorage.removeItem("customer_before_name");
          window.sessionStorage.removeItem("customer_before_manager");
          window.sessionStorage.removeItem("customer_before_telephone");
          window.sessionStorage.removeItem("customer_before_email");
          window.sessionStorage.removeItem("customer_before_address");
          this.setData('2');
        } else {
          message.warning("更新客户信息失败!", 2);
        }
      }).catch(() => {
        message.warning("更新客户信息失败！", 2);
      });
    })
  };

  render() {

    const paginationCustomer = {
      total: this.state.customerData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };
    const paginationAgent = {
      total: this.state.agentData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    const {selectedCustomerRowKeys} = this.state;
    const {selectedAgentRowKeys} = this.state;

    const customerSelection = {
      selectedCustomerRowKeys,
      onChange: this.onSelectChangeCustomer.bind(this)
    };

    const agentSelection = {
      selectedAgentRowKeys,
      onChange: this.onSelectChangeAgent.bind(this)
    };

    return (
      <Card title="客户列表"
            extra={
              <div>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      this.setState({customerVisible:true});
                    }
                  }
                >
                  添加客户
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      this.updateCustomerSale();
                    }
                  }
                >
                  修改信息
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: this.state.chooseCustomer}}
                  onClick={
                    () => {
                      this.customerNext()
                    }
                  }
                >
                  下一步
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: this.state.chooseCustomer}}
                  onClick={
                    () => {
                      window.history.back();
                    }
                  }
                >
                  返回
                </Button>
              </div>
            }
      >
        <Table
          rowSelection={customerSelection}
          columns={this.state.column}
          dataSource={this.state.customerData}
          bordered
          pagination={paginationCustomer}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadCustomer}
          rowKey={"customerId"}
        />
        <CustomerForm
          ref={this.saveCustomerFormRef}
          visible={this.state.customerVisible}
          onCancel={this.handleCustomerCancel}
          onCreate={this.handleCustomerCreate}
        />
        <CustomerUpdateForm
          ref={this.saveCustomerUpdateFormRef}
          visible={this.state.updateCustomerVisible}
          onCancel={this.handleCustomerUpdateCancel}
          onCreate={this.handleCustomerUpdateCreate}
        />
      </Card>
    )
  }
}

module.export = SaleCustomerManagement;
