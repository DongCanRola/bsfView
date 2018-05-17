/**
 * Created by dongc_000 on 2018/5/15.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {purchaseStoreColumn} from './warehouseTable';
import {getPurchaseStoreListByPurchase} from '../../services/warehouseApi';

export default class PurchaseStoreDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      column: purchaseStoreColumn(),
      storeData: [],
      loadingData: true
    };
    this.setData();
  }

  setData() {
    let purchaseId = window.sessionStorage.getItem("look_purchaseStore");
    console.log("get store detail: ", purchaseId);
    getPurchaseStoreListByPurchase(purchaseId).then(resp => {
      console.log("purchase store detail list: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          purchase_storeId: item.purchase_storeId,
          purchase_orderId: item.purchase_orderId,
          purchase_storeWarehouse: item.purchase_storeWarehouse,
          purchase_storeNum: item.purchase_storeNum,
          purchase_storePrice: item.purchase_storePrice,
          purchase_storeRemaining: item.purchase_storeRemaining,
          purchase_storeTime: item.purchase_storeTime,
          purchase_storeUser: item.purchase_storeUser
        });
      }
      this.setState({
        storeData: v,
        loadingData: false
      });
      window.sessionStorage.removeItem("look_purchaseStore");
    }).catch(() => {
      message.warning("获取详细信息失败!", 2);
    })
  }

  render() {

    const pagination = {
      total: this.state.storeData.length,
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
        title="进货存储分配详情"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
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
          columns={this.state.column}
          dataSource={this.state.storeData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"purchase_storeId"}
        />
      </Card>
    )
  }
}

module.export = PurchaseStoreDetail;
