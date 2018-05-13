/**
 * Created by dongc_000 on 2018/5/11.
 */
import React from 'react';
import {Card, Table, message} from 'antd';
import {getOrdersByState} from '../../services/saleApi';
import {completeOrderColumn} from './saleTable';

export default class CancelOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cancelData: [],
      loadingCancel: true,
      column: completeOrderColumn()
    };
    this.setData();
  }

  setData() {
    getOrdersByState('11').then(resp => {
      console.log("cancel orders: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          sale_orderId: item.sale_orderId,
          sale_productId: item.sale_productId,
          sale_num: item.sale_num,
          sale_cost: item.sale_cost,
          sale_price: item.sale_price,
          sale_consumerId: item.sale_consumerId,
          sale_orderTime: item.sale_orderTime,
          sale_user: item.sale_user
        });
      }
      this.setState({
        cancelData: v,
        loadingCancel: false
      });
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
  }

  render() {

    const pagination = {
      total: this.state.cancelData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    return(
      <Card
        title="已取消订单列表"
        extra={
          <div>

          </div>
        }
      >
        <Table
          columns={this.state.column}
          dataSource={this.state.cancelData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingCancel}
          rowKey={"sale_orderId"}
        />
      </Card>
    )
  }
}

module.export = CancelOrderManagement;
