/**
 * Created by dongc_000 on 2018/5/15.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {goodsStockColumn} from './warehouseTable';
import {lookGoodsStockTotal} from '../../services/warehouseApi';

export default class LookGoodsStock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      column: goodsStockColumn(),
      stockData: [],
      loadingData: true,
      selectedRowKeys: []
    };
    this.setData();
  }

  setData() {
    lookGoodsStockTotal().then(resp => {
      console.log("goods stock: ",resp.data.entity);
      let v =[];
      for(let item of resp.data.entity) {
        v.push({
          goods_id: item.goods_id,
          goods_name: item.goods_name,
          goods_remaining: item.goods_remaining
        });
      }
      this.setState({
        stockData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  lookGoodsStockDetail() {
    let goods = this.state.selectedRowKeys;
    if(goods.length !== 1) {
      message.warning("请选择一种货物查看！", 2);
    } else {
      window.sessionStorage.setItem("look_goodsStockDetail", goods[0]);
      browserHistory.push({pathname: '/goodsStockDetail'});
    }
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

    const {selectedRowKeys} = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    };

    return (
      <Card
        title="货物库存情况"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.lookGoodsStockDetail()
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
          dataSource={this.state.stockData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"goods_id"}
        />
      </Card>
    )
  }
}

module.export = LookGoodsStock;
