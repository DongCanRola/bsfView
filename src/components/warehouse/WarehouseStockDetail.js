/**
 * Created by dongc_000 on 2018/5/15.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {lookWarehouseDetail} from '../../services/warehouseApi';
import {stockColumn} from './warehouseTable';

export default class WarehouseStockDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      column: stockColumn(),
      stockData: [],
      loadingData: true
    };
    this.setData();
  }

  setData() {
    lookWarehouseDetail(window.sessionStorage.getItem("look_warehouseStockDetail")).then(resp => {
      console.log("stock detail: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          stock_warehouseId: item.stock_warehouseId,
          stock_goodsId: item.stock_goodsId,
          stock_num: item.stock_num
        });
      }
      this.setState({
        stockData: v,
        loadingData: false
      });
      window.sessionStorage.removeItem("look_warehouseStockDetail");
    }).catch(() => {
      message.warning("获取仓库库存详情失败!", 2);
    })
  }

  render() {

    const pagination = {
      total: this.state.stockData.length,
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
        title="库存详情"
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
          dataSource={this.state.stockData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"stock_goodsId"}
        />
      </Card>
    )
  }
}

module.export = WarehouseStockDetail;
