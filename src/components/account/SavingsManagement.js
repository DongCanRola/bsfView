/**
 * Created by dongc_000 on 2018/5/4.
 */
import React from 'react';
import {Card, Button, Table, Form, Modal, Input, Select, message} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {getAllSavings, addSavings} from '../../services/accountApi';

const FormItem = Form.Item;
const SavingsForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="新增账户"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="ID">
            {getFieldDecorator('newSavingsId',{
              rules: [{ required:true, message: '请输入账户ID！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="机构">
            {getFieldDecorator('newSavingsBank',{
              rules: [{ required:true, message: '请输入账户所属机构！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="初始余额">
            {getFieldDecorator('newSavingsBalance', {
              rules: [{ required: true, message: '请输入账户初始余额！'}],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

export default class SavingsManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      savingsManagement: window.sessionStorage.getItem("pay_id") === null ? 'inline':'none',
      payChoose: window.sessionStorage.getItem("pay_id") !== null ? 'inline':'none',
      savingsData: [],
      addVisible: false,
      loadingSavings: true,
      selectedRowKeys: [],
      selectedRows: [],
      column: [
        {
          title: "号码",
          dataIndex: "savings_id",
          width: "33%"
        },{
          title: "账户所属机构",
          dataIndex: "savings_bank",
          width: "33%"
        },{
          title: "余额",
          dataIndex: "savings_balance",
          width: "33%"
        }
      ],

      //销售收款
      gatherChoose: window.sessionStorage.getItem("gather_id") !== null ? 'inline':'none'
    };
    this.setData();
  }

  setData() {
    getAllSavings().then(resp => {
      console.log(resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          savings_id: item.savings_id,
          savings_bank: item.savings_bank,
          savings_balance: item.savings_balance
        });
      }
      this.setState({
        savingsData: v,
        loadingSavings: false
      });
    }).catch(() => {
      message.warning("获取账户列表失败！");
    });
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    console.log("selectedRows changed: ", selectedRows);
    this.setState({selectedRowKeys,selectedRows});
  }

  saveFormRef = (form) => {
    this.form = form;
  };
  handleCancel = () => {
    this.setState({agentVisible: false});
  };
  handleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      var obj = {
        savings_id: values.newSavingsId,
        savings_bank: values.newSavingsBank,
        savings_balance: values.newSavingsBalance
      };
      addSavings(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("添加成功！", 5);
          this.setData();
          this.setState({addVisible: false});
        }
      }).catch(() => {
        message.warning("添加失败！");
      });
    })
  };

  choosePaySavings() {
    let chooseSavings = this.state.selectedRows;
    if(chooseSavings.length !== 1) {
      message.warning("请选择一个账户付款！", 2);
    } else {
      window.sessionStorage.setItem("pay_savings", chooseSavings[0].savings_id);
      window.sessionStorage.setItem("pay_usable", chooseSavings[0].savings_balance);
      browserHistory.push({pathname: '/purchasePay'});
    }
  }

  chooseGatherSavings() {
    let savings = this.state.selectedRows;
    if(savings.length !== 1) {
      message.warning("请选择一个账户！", 2);
    } else {
      window.sessionStorage.setItem("gather_savings", savings[0].savings_id);
      browserHistory.push({pathname: '/saleGather'});
    }
  }

  lookPayDetail() {
    let savings = this.state.selectedRowKeys;
    if(savings.length !== 1) {
      message.warning("请选择一个账户！", 2);
    } else {
      window.sessionStorage.setItem("savings_look_detail_pay_id", savings[0]);
      browserHistory.push({pathname: '/savingsPayDetail'});
    }
  }

  lookGatherDetail() {
    let savings = this.state.selectedRowKeys;
    if(savings.length !== 1) {
      message.warning("请选择一个账户！", 2);
    } else {
      window.sessionStorage.setItem("savings_look_detail_gather_id", savings[0]);
      browserHistory.push({pathname: '/savingsGatherDetail'});
    }
  }

  render() {

    const paginationSavings = {
      total: this.state.savingsData.length,
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
      <Card title="账户列表"
            extra={
              <div>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: 'inline'}}
                  onClick={
                    () => {
                      this.setState({addVisible:true});
                    }
                  }
                >
                  添加账户
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: 'inline'}}
                  onClick={
                    () => {
                      this.lookPayDetail();
                    }
                  }
                >
                  查看付款详情
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: 'inline'}}
                  onClick={
                    () => {
                      this.lookGatherDetail();
                    }
                  }
                >
                  查看收款详情
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: this.state.payChoose}}
                  onClick={
                    () => {
                      this.choosePaySavings();
                    }
                  }
                >
                  下一步
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: this.state.payChoose}}
                  onClick={
                    () => {
                      window.sessionStorage.removeItem("pay_id");
                      window.sessionStorage.removeItem("pay_savings");
                      window.sessionStorage.removeItem("pay_usable");
                    }
                  }
                >
                  返回
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: this.state.gatherChoose}}
                  onClick={
                    () => {
                      this.chooseGatherSavings();
                    }
                  }
                >
                  收款
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10, display: this.state.gatherChoose}}
                  onClick={
                    () => {
                      window.sessionStorage.removeItem("gather_id");
                      window.sessionStorage.removeItem("gather_savings");
                    }
                  }
                >
                  返回
                </Button>
              </div>
            }>
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.savingsData}
          bordered
          pagination={paginationSavings}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingSavings}
          rowKey={"savings_id"}
        />
        <div>
          <SavingsForm
            ref={this.saveFormRef}
            visible={this.state.addVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
        </div>
      </Card>
    )
  }
}

module.export = SavingsManagement;
