/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message, Modal, Input} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {saleOrderColumn} from './warehouseTable';
import {getOrdersByState} from '../../services/saleApi';
import {storeProduct} from '../../services/warehouseApi';

export default class ProductStoreManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      waitData: [],
      waitColumn: saleOrderColumn(),
      loadingData: true,
      selectedRowKeys: [],
      selectedRows: [],

      storeVisible: window.sessionStorage.getItem("sale_store_warehouse") !== null,
      storeNum: ''
    };
    this.setData();
  }

  setData() {
    getOrdersByState('6').then(resp => {
      console.log("get sale orders to store: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          sale_orderId: item.sale_orderId,
          sale_productId: item.sale_productId,
          sale_num: item.sale_num,
          store_remaining: item.store_remaining,
          sale_orderTime: item.sale_orderTime,
          sale_user: item.sale_user
        });
      }
      this.setState({
        waitData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取数据失败!", 2);
    })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    console.log("selectedRows changed: ", selectedRows);
    this.setState({selectedRowKeys, selectedRows});
  }

  storeProduct() {
    let item = this.state.selectedRows;
    if(item.length !== 1) {
      message.warning("请选择一个订单进行入库！", 2);
    } else {
      window.sessionStorage.setItem("sale_store_order_id", item[0].sale_orderId);
      window.sessionStorage.setItem("sale_store_wait_num", item[0].store_remaining);
      browserHistory.push({pathname: '/warehouseManagement'});
    }
  }

  getStoreNum(inValue) {
    console.log("store num: ", inValue);
    this.setState({
      storeNum: inValue
    });
  }
  handleStoreSubmit = () => {
    let warehouse_spare = window.sessionStorage.getItem("sale_warehouse_spare");
    let sale_wait = window.sessionStorage.getItem("sale_store_wait_num");
    let store_num = this.state.storeNum;
    if(store_num > warehouse_spare || store_num > sale_wait) {
      message.warning("存入数量过多！", 2);
    } else {
      let obj = {
        store_saleId: window.sessionStorage.getItem("sale_store_order_id"),
        store_warehouseId: window.sessionStorage.getItem("sale_store_warehouse"),
        store_num: store_num,
        store_remaining: store_num,
        store_user: window.sessionStorage.getItem("userId")
      };
      storeProduct(obj).then(resp => {
        console.log("result of store product: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("成功存储！", 2);
          this.setData();
          this.setState({storeVisible: false});
          window.sessionStorage.removeItem("sale_store_order_id");
          window.sessionStorage.removeItem("sale_store_warehouse");
          window.sessionStorage.removeItem("sale_store_wait_num");
          window.sessionStorage.removeItem("sale_warehouse_spare");
        } else {
          message.warning("存入失败，请检查存入数量！", 2);
        }
      }).catch(() => {
        message.warning("存入失败！", 2);
      })
    }
  };
  handleStoreCancel = () => {
    this.setState({storeVisible: false});
    window.sessionStorage.removeItem("sale_store_order_id");
    window.sessionStorage.removeItem("sale_store_warehouse");
    window.sessionStorage.removeItem("sale_store_wait_num");
    window.sessionStorage.removeItem("sale_warehouse_spare");
  };

  lookProductStoreDetail() {
    let items = this.state.selectedRowKeys;
    if(items.length !== 1) {
      message.warning("请选择要查看的一个销售单！", 2);
    } else {
      window.sessionStorage.setItem("sale_store_look_order_id", items[0]);
      browserHistory.push({pathname: '/productStoreDetail'});
    }
  }

  render() {

    const pagination = {
      total: this.state.waitData.length,
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
      <Card
        title="销售单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.storeProduct()
                }
              }
            >
              入库
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.lookProductStoreDetail()
                }
              }
            >
              查看入库
            </Button>
          </div>
        }
      >
       <Table
         rowSelection={rowSelection}
         columns={this.state.waitColumn}
         dataSource={this.state.waitData}
         bordered
         pagination={pagination}
         scroll={{x: 1000, y: 1000}}
         loading={this.state.loadingData}
         rowKey={"sale_orderId"}
       />
        <Modal
          visible={this.state.storeVisible}
          title={"存入"+window.sessionStorage.getItem("sale_store_warehouse")+",可用空间"+window.sessionStorage.getItem("sale_warehouse_spare")}
          onOk={() => {this.handleStoreSubmit()}}
          onCancel={() => {this.handleStoreCancel()}}
        >
          <p>{"订单"+window.sessionStorage.getItem("sale_store_order_id")+"有"+window.sessionStorage.getItem("sale_store_wait_num")+"待存储"}</p>
          <Input id="numToStore" onChange={value => this.getStoreNum(value.target.value)}/>
        </Modal>
      </Card>
    )
  }
}

module.export = ProductStoreManagement;
