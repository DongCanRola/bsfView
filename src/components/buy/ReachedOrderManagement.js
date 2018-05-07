/**
 * Created by dongc_000 on 2018/5/5.
 */
import React from 'react';
import {Card, Button, message, Table} from 'antd';
import {getOrdersByState,changeOrderState} from '../../services/purchaseApi';
import {orderColumn} from './buyTable';

export default class ReachedOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      reachedData: [],
      loadingData: true,
      selectedRowKeys: [],
      column: orderColumn()
    };
    this.setData();
  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  setData() {
    getOrdersByState("3").then(resp => {
      console.log("到货订单：",resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          purchaseOrder_id: item.purchaseOrder_id,
          purchaseGoods_name: item.purchaseGoods_name,
          purchase_num: item.purchase_num,
          purchase_price: item.purchase_price,
          provider_name: item.provider_name,
          purchase_time: item.purchase_time
        });
      }
      console.log(v);
      this.setState({
        reachedData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取订单列表失败！");
    })
  }

  cancelOrder() {
    let orders = this.state.selectedRowKeys;
    if(orders.length === 0) {
      message.warning("请选择需要取消的订单！", 2);
    } else {
      for(let order of orders) {
        var obj = {
          orderId: order,
          toState: "5"
        };
        changeOrderState(obj).then(resp => {
          console.log(resp.data.entity);
          if(resp.data.entity.result === 'ok') {
            message.success("订单" + order + "已取消", 2);
            this.setData();
          }
        }).catch(() => {
          message.warning("取消失败！", 2);
        });
      }
    }
  }

  render() {

    const pagination = {
      total: this.state.reachedData.length,
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
        title="已到货订单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  //this.setState({customerVisible:true});
                  this.cancelOrder();
                }
              }
            >
              取消订单
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  //this.setState({customerVisible:true});
                }
              }
            >
              退货
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.reachedData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"purchaseOrder_id"}
        />
      </Card>
    )
  }
}

module.export = ReachedOrderManagement;
