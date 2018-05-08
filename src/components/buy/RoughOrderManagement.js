/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Form, Table, Button, message, Collapse, Modal, Input} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {orderColumn} from './buyTable';
import {getOrdersByState,addNewOrder,changeOrderState,confirmOrder} from '../../services/purchaseApi';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

const FormItem = Form.Item;
const PurchaseOrderForm = Form.create() (
  (props) => {
    const { visible, title, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={title}
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="数量">
            {getFieldDecorator('orderNum',{
              rules: [{ required:true, message: '请输入进货数量！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="单价">
            {getFieldDecorator('orderPrice',{
              rules: [{ required:true, message: '请输入进货单价！'}],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

export default class RoughOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addNewVisible: (window.sessionStorage.getItem("newBuyMaterial") !== null) && (window.sessionStorage.getItem("newBuyCustomer") !== null),
      newBuyGoods: window.sessionStorage.getItem("newBuyMaterial") === null ? '': window.sessionStorage.getItem("newBuyMaterial"),
      newBuyCustomer: window.sessionStorage.getItem("newBuyCustomer") === null ? '' : window.sessionStorage.getItem("newBuyCustomer"),
      roughData: [],
      loadingData: true,
      selectedRowKeys: [],
      selectedRows: [],
      column: orderColumn(),
      discountVisible: false,
      discountValue: ''
    };
    this.setData();
  }

  /*
   static judgeBuyAdd() {
   return (window.sessionStorage.getItem("newBuyMaterial") !== null) &&
   (window.sessionStorage.getItem("newBuyCustomer") !== null);
   }
   */

  setData() {
    getOrdersByState("1").then(resp => {
      console.log("进货订单草稿：",resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          purchaseOrder_id: item.purchaseOrder_id,
          purchaseGoods_name: item.purchaseGoods_name,
          purchase_num: item.purchase_num,
          purchase_price: item.purchase_price,
          provider_name: item.provider_name,
          purchase_time: item.purchase_time
        });
      }
      console.log(v);
      this.setState({
        roughData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取订单列表失败！");
    })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    console.log("selectedRoughRowKeys changed: ", selectedRowKeys);
    console.log("selectedRoughRows changed: ",selectedRows);
    this.setState({selectedRowKeys, selectedRows});
  }

  addOrder() {
    browserHistory.push({pathname: '/materialChoose'});
    console.log("增加新订单！");
  }

  saveFormRef = (form) => {
    this.form = form;
  };
  handleAddCancel = () => {
    window.sessionStorage.removeItem("newBuyMaterial");
    window.sessionStorage.removeItem("newBuyCustomer");
    this.setState({
      addNewVisible: false
    });
  };
  handleAddCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      var obj = {
        purchaseGoods_id: this.state.newBuyGoods,
        purchase_num: values.orderNum,
        purchase_price: values.orderPrice,
        provider_id: this.state.newBuyCustomer
      };
      console.log("new order: ", obj);
      window.sessionStorage.removeItem("newBuyMaterial");
      window.sessionStorage.removeItem("newBuyCustomer");
      window.sessionStorage.removeItem("newBuyOrder");
      addNewOrder(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("成功添加订单，订单编号为：" + resp.data.entity.message, 5);
          this.setData();
          this.setState({
            addNewVisible: false
          });
        } else {
          message.warning("添加订单失败，请重新操作！", 2);
        }
      }).catch(() => {
        message.warning("添加订单失败！", 2);
      })
    })
  };

  confirmOrder() {
    this.setState({discountVisible: true});
  }
  getInputDiscount(discount) {
    console.log("折扣：",discount);
    this.setState({discountValue: discount});
  }
  handleConfirmOk = () => {
    //let orders = this.state.selectedRowKeys;
    let orders = this.state.selectedRows;
    if(orders.length === 0) {
      message.warning("请选择需要确认的订单！", 2);
    } else {
      for(let order of orders) {
        var obj = {
          orderId: order.purchaseOrder_id,
          toState: "2",
          orderDiscount: this.state.discountValue,
          orderNum: order.purchase_num,
          orderPrice: order.purchase_price
        };
        confirmOrder(obj).then(resp => {
          console.log(resp.data.entity);
          if(resp.data.entity.result === 'ok') {
            message.success("订单" + order + "已确认", 2);
            this.setData();
            this.setState({discountVisible: false});
          }
        }).catch(() => {
          message.warning("确认失败！", 2);
        });
      }
    }
    console.log("确认订单！");
  };
  handleConfirmCancel = () => {
    this.setState({discountVisible: false});
  };

  cancelOrder() {
    let orders = this.state.selectedRowKeys;
    if(orders.length === 0) {
      message.warning("请选择需要取消的订单！", 2);
    } else {
      for(let order of orders) {
        var obj = {
          orderId: order,
          toState: "5"
        };
        changeOrderState(obj).then(resp => {
          console.log(resp.data.entity);
          if(resp.data.entity.result === 'ok') {
            message.success("订单" + order + "已取消", 2);
            this.setData();
          }
        }).catch(() => {
          message.warning("取消失败！", 2);
        });
      }
    }
    console.log("取消订单！");
  }

  render() {

    const pagination = {
      total: this.state.roughData.length,
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
      <Card title="未定订单列表"
            extra={
              <div>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      //this.setState({customerVisible:true});
                      this.addOrder();
                    }
                  }
                >
                  新增订单
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      //this.setState({customerVisible:true});
                      this.confirmOrder();
                    }
                  }
                >
                  确认订单
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      //this.setState({customerVisible:true});
                      this.cancelOrder();
                    }
                  }
                >
                  取消订单
                </Button>
              </div>
            }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.roughData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"purchaseOrder_id"}
        />
        <PurchaseOrderForm
          ref={this.saveFormRef}
          visible={this.state.addNewVisible}
          title= {"货物编号："+this.state.newBuyGoods+", 供应商编号："+this.state.newBuyCustomer}
          onCancel={this.handleAddCancel}
          onCreate={this.handleAddCreate}
        />
        <Modal
          visible={this.state.discountVisible}
          title="设置进货折扣"
          onOk={() => {this.handleConfirmOk()}}
          onCancel={() => {this.handleConfirmCancel()}}
        >
          <Input id="purchaseDiscount" onChange={value => this.getInputDiscount(value.target.value)}/>
        </Modal>
      </Card>
    )
  }
}

module.export = RoughOrderManagement;
