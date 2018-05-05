/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Form, Table, Button, message, Collapse} from 'antd';
import browserHistory from 'dva/router';

import {orderColumn} from './buyTable';
import {getOrdersByState,addNewOrder} from '../../services/purchaseApi';

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

  }
);

export default class RoughOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addNewVisible: this.judgeBuyAdd,
      newBuyGoods: window.sessionStorage.getItem("newBuyMaterial") === null ? '': window.sessionStorage.getItem("newBuyMaterial"),
      newBuyCustomer: window.sessionStorage.getItem("newBuyCustomer") === null ? '' : window.sessionStorage.getItem("newBuyCustomer"),
      roughData: [],
      loadingData: true,
      selectedRowKeys: [],
      column: orderColumn()
    };
    this.setData();
  }

  static judgeBuyAdd() {
    return (window.sessionStorage.getItem("newBuyMaterial") !== null) &&
      (window.sessionStorage.getItem("newBuyCustomer") !== null);
  }

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

  onSelectChange(selectedRowKeys) {
    console.log("selectedRoughRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  addOrder() {
    console.log("增加新订单！");
  }

  confirmOrder() {
    console.log("确认订单！");
  }

  cancelOrder() {
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
      </Card>
    )
  }
}

module.export = RoughOrderManagement;
