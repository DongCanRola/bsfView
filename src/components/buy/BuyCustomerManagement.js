/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Button, Table, Form, Modal, Input, Select, message, Collapse} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {customerColumn} from './buyTable';
import {getCustomerByProvide, addCustomer} from '../../services/customerApi';

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
        title="新增原材料供应商"
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

const AgentForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="新增加工材料供应商"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="名称">
            {getFieldDecorator('newAgentName',{
              rules: [{ required:true, message: '请输入客户名称！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="负责人">
            {getFieldDecorator('newAgentManager',{
              rules: [{ required:true, message: '请输入客户负责人！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="电话">
            {getFieldDecorator('newAgentPhone', {
              rules: [{ required: true, message: '请输入客户电话号码！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="邮箱">
            {getFieldDecorator('newAgentEmail')(<Input/>)}
          </FormItem>
          <FormItem label="地址">
            {getFieldDecorator('newAgentAddress',{
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

export default class BuyCustomerManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customerData: [],
      agentData: [],
      selectedCustomerRowKeys: [],
      selectedAgentRowKeys: [],
      column: customerColumn(),

      customerVisible: false,
      agentVisible: false,
      loadCustomer: true,
      loadAgent: true,

      rawChoose: (window.sessionStorage.getItem("newBuyOrder") !== null) && (window.sessionStorage.getItem("newBuyOrder") !== "1"),
      makingsChoose: (window.sessionStorage.getItem("newBuyOrder") !== null) && (window.sessionStorage.getItem("newBuyOrder") !== "2"),
      chooseVisible: window.sessionStorage.getItem("newBuyOrder") !== null ? 'inline':'none'
    };
    this.setData("1");
    this.setData("2");
  }

  setData(type) {
    let kind = type;
    getCustomerByProvide(type).then(resp => {
      console.log(resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          customerId: item.id,
          customerType: item.type,
          provideType: item.provideType,
          customerName: item.name,
          customerManager: item.manager,
          customerTelephone: item.telephone,
          customerEmail: item.email,
          customerAddress: item.address
        });
      }
      if(kind === "1") {
        this.setState({
          customerData: v,
          loadCustomer: false
        });
      }
      if(kind === "2") {
        this.setState({
          agentData: v,
          loadAgent: false
        });
      }
    }).catch();
  }

  /*
   judgeRawChoose() {
   return window.sessionStorage.getItem("newBuyOrder") !== "1";
   }

   judgeMakingsChoose() {
   return window.sessionStorage.getItem("newBuyOrder") !== "2";
   }
   */

  /*
   setChoose() {
   let item = window.sessionStorage.getItem("newBuyOrder");
   window.sessionStorage.removeItem("newBuyOrder");
   if(item === "1") {
   this.setState({
   makingsChoose: true,
   rawChoose: false,
   chooseVisible: true
   });
   }
   if(item === "2") {
   this.setState({
   rawChoose: true,
   makingsChoose: false,
   chooseVisible: true
   });
   }
   }
   */

  chooseOneBuyFrom(type) {
    let materialType = window.sessionStorage.getItem("newBuyOrder");
    if(type === "1") {
      if(this.state.selectedCustomerRowKeys.length !== 1 || materialType !==  "1") {
        message.warning("请选择一个原料供应商！",2);
      } else {
        window.sessionStorage.setItem("newBuyCustomer", this.state.selectedCustomerRowKeys[0]);
        browserHistory.push({pathname: '/roughOrderManagement'});
      }
    } else {
      if(this.state.selectedAgentRowKeys.length !== 1 || materialType !== "2") {
        message.warning("请选择一个加工材料供应商！",2);
      } else {
        window.sessionStorage.setItem("newBuyCustomer", this.state.selectedAgentRowKeys[0]);
        browserHistory.push({pathname: '/roughOrderManagement'});
      }
    }
  }

  cancelChoose() {
    window.sessionStorage.removeItem("newBuyCustomer");
    window.history.back();
  }

  onSelectChangeCustomer(selectedCustomerRowKeys) {
    console.log("selectedCustomerRowKeys changed: ", selectedCustomerRowKeys);
    this.setState({selectedCustomerRowKeys});
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
        type: "1",
        provideType: "1",
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
          this.setData("1");
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
        type: "1",
        provideType: "2",
        manager: values.newAgentManager,
        telephone: values.newAgentPhone,
        email: values.newAgentEmail,
        address: values.newAgentAddress
      };
      console.log("new agent: ", obj);
      addCustomer(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("添加成功，新客户ID为"+resp.data.entity.message, 5);
          this.setData("2");
          this.setState({agentVisible: false});
        }
      }).catch(() => {
        message.warning("添加失败！");
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
      <Card>
        <div>
          <Collapse bordered={false} defaultActiveKey={["1","2"]} style={{marginTop: 30}}>
            <Panel header="原材料供应商" key="1" style={customPanelStyle}>
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
                          添加供应商
                        </Button>
                        <Button
                          style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.chooseVisible}}
                          onClick={
                            () => {
                              //this.setState({rawVisible:true});
                              this.chooseOneBuyFrom("1");
                            }
                          }
                        >
                          下一步
                        </Button>
                        <Button
                          style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.chooseVisible}}
                          onClick={
                            () => {
                              //window.history.back();
                              this.cancelChoose();
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
              </Card>
            </Panel>
            <Panel header="加工材料供应商" key="2" style={customPanelStyle}>
              <Card title="客户列表"
                    extra={
                      <div>
                        <Button
                          style={{width: 120, marginRight: 5, marginLeft: 10}}
                          onClick={
                            () => {
                              this.setState({agentVisible:true});
                            }
                          }
                        >
                          添加供应商
                        </Button>
                        <Button
                          style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.chooseVisible}}
                          onClick={
                            () => {
                              //this.setState({rawVisible:true});
                              this.chooseOneBuyFrom("2");
                            }
                          }
                        >
                          下一步
                        </Button>
                        <Button
                          style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.chooseVisible}}
                          onClick={
                            () => {
                              //window.history.back();
                              this.cancelChoose();
                            }
                          }
                        >
                          返回
                        </Button>
                      </div>
                    }
              >
                <Table
                  rowSelection={agentSelection}
                  columns={this.state.column}
                  dataSource={this.state.agentData}
                  bordered
                  pagination={paginationAgent}
                  scroll={{x: 1000, y: 1000}}
                  loading={this.state.loadAgent}
                  rowKey={"customerId"}
                />
                <AgentForm
                  ref={this.saveAgentFormRef}
                  visible={this.state.agentVisible}
                  onCancel={this.handleAgentCancel}
                  onCreate={this.handleAgentCreate}
                />
              </Card>
            </Panel>
          </Collapse>
        </div>
      </Card>
    )
  }
}

module.export = BuyCustomerManagement;
