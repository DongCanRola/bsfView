/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {saleOrderSendColumn} from './warehouseTable';
import {getOrdersByState} from '../../services/saleApi';

export default class ProductSendManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      waitData: [],
      waitColumn: saleOrderSendColumn(),
      loadingData: true,
      selectedRowKeys: [],
      selectedRows: [],
    };
    this.setData();
  }

  setData() {
    getOrdersByState('7').then(resp => {
      console.log("get sale orders to send: ", resp.data.entity);
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

  sendProduct() {
    let items = this.state.selectedRows;
    if(items.length !== 1) {
      message.warning("请选择一个要出库的销售单！", 2);
    } else {
      window.sessionStorage.setItem("sale_store_look_order_id", items[0].sale_orderId);
      window.sessionStorage.setItem("sale_send", 'yes');
      browserHistory.push({pathname: '/productStoreDetail'});
    }
  }

  lookStoreDetail() {
    let items = this.state.selectedRowKeys;
    if(items.length !== 1) {
      message.warning("请选择要查看的一个销售单！", 2);
    } else {
      window.sessionStorage.setItem("sale_store_look_order_id", items[0]);
      browserHistory.push({pathname: '/productStoreDetail'});
    }
  }

  lookSendDetail() {
    let items = this.state.selectedRowKeys;
    if(items.length !== 1) {
      message.warning("请选择要查看的一个销售单！", 2);
    } else {
      window.sessionStorage.setItem("sale_send_look_order_id", items[0]);
      browserHistory.push({pathname: '/productSendDetail'});
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
                  this.sendProduct()
                }
              }
            >
              出库
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.lookStoreDetail()
                }
              }
            >
              查看入库
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.lookSendDetail()
                }
              }
            >
              查看出库
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
      </Card>
    )
  }

}

module.export = ProductSendManagement;
