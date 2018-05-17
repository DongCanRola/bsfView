/**
 * Created by dongc_000 on 2018/5/5.
 */
import React from 'react';
import {Card, Button, message, Table} from 'antd';
import {getOrdersByState,changeOrderState} from '../../services/purchaseApi';
import {orderColumn} from './buyTable';

export default class SavedOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      savedData: [],
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
    getOrdersByState("4").then(resp => {
      console.log("已入库订单：",resp.data.entity);
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
        savedData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取订单列表失败！");
    })
  }

  render() {

    const pagination = {
      total: this.state.savedData.length,
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
        title="已入库订单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display: 'none'}}
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
          dataSource={this.state.savedData}
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

module.export = SavedOrderManagement;
