/**
 * Created by dongc_000 on 2018/5/15.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {stockColumn} from './warehouseTable';
import {lookGoodsStockDetail} from '../../services/warehouseApi';

export default class GoodsStockDetail extends React.Component {

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
    lookGoodsStockDetail(window.sessionStorage.getItem("look_goodsStockDetail")).then(resp => {
      console.log("goods stock detail: ", resp.data.entity);
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
      window.sessionStorage.removeItem("look_goodsStockDetail");
    }).catch(() => {
      message.warning("获取数据失败！", 2);
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
        title="货物存储详情"
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
          rowKey={"stock_warehouseId"}
        />
      </Card>
    )
  }
}

module.export = GoodsStockDetail;
