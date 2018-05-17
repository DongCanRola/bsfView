/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {getProductStoreBySale} from '../../services/warehouseApi';
import {productStoreColumn} from './warehouseTable';

export default class ProductStoreDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      storeData: [],
      column: productStoreColumn(),
      loadingData: true,
      lookSale: window.sessionStorage.getItem("sale_store_look_order_id")
    };
    this.setData();
  }

  setData() {
    getProductStoreBySale(this.state.lookSale).then(resp => {
      console.log("sale store detail: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          store_id: item.store_id,
          store_saleId: item.store_saleId,
          store_warehouseId: item.store_warehouseId,
          store_num: item.store_num,
          store_remaining: item.store_remaining,
          store_time: item.store_time,
          store_user: item.store_user
        });
      }
      this.setState({
        storeData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
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

    return (
      <Card
        title="存储列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  window.sessionStorage.removeItem("sale_store_look_order_id");
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
          dataSource={this.state.storeData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"store_id"}
        />
      </Card>
    )
  }
}

module.export = ProductStoreDetail;
