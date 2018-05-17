/**
 * Created by dongc_000 on 2018/5/8.
 */
import React from 'react';
import {Card, Table, Button, message, Form, Modal, Input} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {getPurchasePayList, addPurchasePayDetail} from '../../services/accountApi';

export default class PurchasePayManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      column: [
        {
          title: "编号",
          dataIndex: "purchasePay_id",
          width: "10%"
        },{
          title: "进货订单",
          dataIndex: "purchase_id",
          width: "10%"
        },{
          title: "预定总额",
          dataIndex: "plan_total",
          width: "10%"
        },{
          title: "折扣",
          dataIndex: "discount",
          width: "10%"
        },{
          title: "实际总额",
          dataIndex: "actual_total",
          width: "10%"
        },{
          title: "已付",
          dataIndex: "already_pay",
          width: "10%"
        },{
          title: "剩余应付",
          dataIndex: "surplus",
          width: "10%"
        },{
          title: "订单时间",
          dataIndex: "order_time",
          width: "25%"
        }
      ],
      purchasePayData: [],
      loadingData: true,
      payVisible: window.sessionStorage.getItem("pay_savings") !== null,
      moneyToPay: ''
    };
    this.setData();
  }

  setData() {
    getPurchasePayList().then(resp => {
      console.log("purchase order pay list: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          purchasePay_id: item.purchasePay_id,
          purchase_id: item.purchase_id,
          plan_total: item.plan_total,
          discount: item.discount,
          actual_total: item.actual_total,
          already_pay: item.already_pay,
          surplus: item.surplus,
          order_time: item.order_time
        });
      }
      this.setState({
        purchasePayData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取进货订单付款单失败！", 2);
    });
  }

  purchasePay() {
    let toPay = this.state.selectedRowKeys;
    if(toPay.length !== 1) {
      message.warning("请选择一个付款单进行付款！", 2);
    } else {
      window.sessionStorage.setItem("pay_id", this.state.selectedRowKeys[0]);
      browserHistory.push({pathname: '/savingsManagement'});
    }
  }

  onSelectChangePurchasePay(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  getMoney(setValue) {
    console.log("money to pay: ", setValue);
    this.setState({moneyToPay: setValue});
  }
  handlePaySubmit = () => {
    var obj = {
      pay_id : window.sessionStorage.getItem("pay_id"),
      pay_money: this.state.moneyToPay,
      pay_user: window.sessionStorage.getItem("userId"),
      pay_savings: window.sessionStorage.getItem("pay_savings")
    };
    addPurchasePayDetail(obj).then(resp => {
      console.log(resp.data.entity);
      if(resp.data.entity.result === 'ok') {
        message.success("成功添加付款！" + resp.data.entity.message, 5);
        window.sessionStorage.removeItem("pay_id");
        window.sessionStorage.removeItem("pay_savings");
        window.sessionStorage.removeItem("pay_usable");
        this.setState({
          payVisible: false
        });
        this.setData();
      } else {
        message.success("请检查付款金额！", 2);
      }
    }).catch(() => {
      message.warning("添加付款失败！", 2);
    })
  };
  handlePayCancel = () => {
    this.setState({
      payVisible: false
    });
    window.sessionStorage.removeItem("pay_id");
    window.sessionStorage.removeItem("pay_savings");
    window.sessionStorage.removeItem("pay_usable");
  };

  lookDetail() {
    let pays = this.state.selectedRowKeys;
    if(pays.length !== 1) {
      message.warning("请选择一项查看！", 2);
    } else {
      window.sessionStorage.setItem("look_payId", pays[0]);
      browserHistory.push({pathname: '/purchasePayDetail'});
    }
  }

  render() {

    const pagination = {
      total: this.state.purchasePayData.length,
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
      onChange: this.onSelectChangePurchasePay.bind(this)
    };

    return (
      <Card
        title="进货付款单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.purchasePay();
                }
              }
            >
              付款
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.lookDetail();
                }
              }
            >
              查看详情
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.purchasePayData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"purchasePay_id"}
        />
        <Modal
          visible={this.state.payVisible}
          title={"付款账户：" + window.sessionStorage.getItem("pay_savings") + "，账户余额：" + window.sessionStorage.getItem("pay_usable")}
          destroyOnClose={true}
          onOk={() => {this.handlePaySubmit()}}
          onCancel={() => {this.handlePayCancel()}}
        >
          <Input id="payMoney" onChange={value => this.getMoney(value.target.value)}/>
        </Modal>
      </Card>
    )
  }
}

module.export = PurchasePayManagement;
