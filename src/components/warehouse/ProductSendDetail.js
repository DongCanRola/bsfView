/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {getProductSendBySale} from '../../services/warehouseApi';
import {productSendColumn} from './warehouseTable';

export default class ProductSendDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sendData: [],
      column: productSendColumn(),
      loadingData: true,
      lookSale: window.sessionStorage.getItem("sale_send_look_order_id")
    };
    this.setData();
  }

  setData() {
    getProductSendBySale(this.state.lookSale).then(resp => {
      console.log("sale send detail: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          send_id: item.send_id,
          send_storeId: item.send_storeId,
          send_num: item.send_num,
          send_time: item.send_time,
          send_user: item.send_user
        });
      }
      this.setState({
        sendData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取数据失败!", 2);
    })
  }

  render() {

    const pagination = {
      total: this.state.sendData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    return (
      <Card
        title="发货列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  window.sessionStorage.removeItem("sale_send_look_order_id");
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
          columns={this.state.column}
          dataSource={this.state.sendData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"send_id"}
        />
      </Card>
    )
  }
}

module.export = ProductSendDetail;
