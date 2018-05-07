/**
 * Created by dongc_000 on 2018/5/5.
 */
import React from 'react';
import {Card, Button, message, Table} from 'antd';
import {getOrdersByState,changeOrderState} from '../../services/purchaseApi';
import {orderColumn} from './buyTable';

export default class AllreOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allreData: [],
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
    getOrdersByState("7").then(resp => {
      console.log("完全退货订单：",resp.data.entity);
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
        allreData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取订单列表失败！");
    })
  }

  render() {

    const pagination = {
      total: this.state.allreData.length,
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
    }

    return (
      <Card
        title="完全退货订单列表"
        extra={
          <div>

          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.allreData}
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

module.export = AllreOrderManagement;
