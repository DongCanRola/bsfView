/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';
import {planOrderColumn} from './saleTable';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {getOrdersByState} from '../../services/saleApi';

export default class PlanOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      planData: [],
      loadingData: true,
      selectedRowKeys: [],
      column: planOrderColumn()
    };
    this.setData();
  }

  setData() {
    getOrdersByState('1').then(resp => {
      console.log(resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          sale_orderId: item.sale_orderId,
          sale_productId: item.sale_productId,
          sale_consumerId: item.sale_consumerId,
          sale_orderTime: item.sale_orderTime,
          sale_user: item.sale_user
        });
      }
      this.setState({
        planData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取订单列表失败！", 2);
    })
  }

  onSelectChangePlan(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  render() {

    const pagination = {
      total: this.state.planData.length,
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
      onChange: this.onSelectChangePlan.bind(this)
    };

    return (
      <Card
        title="计划订单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  //this.setState({customerVisible:true});
                }
              }
            >
              添加订单
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.planData}
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

module.export = PlanOrderManagement;
