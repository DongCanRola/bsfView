/**
 * Created by dongc_000 on 2018/5/8.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';
import {getPurchasePayList} from '../../services/accountApi';

export default class PurchasePayManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      column: [
        {
          title: "编号",
          dataIndex: "purchasePay_id",
          width: "10%"
        },{
          title: "进货订单",
          dataIndex: "purchase_id",
          width: "10%"
        },{
          title: "预定总额",
          dataIndex: "plan_total",
          width: "10%"
        },{
          title: "折扣",
          dataIndex: "discount",
          width: "10%"
        },{
          title: "实际总额",
          dataIndex: "actual_total",
          width: "10%"
        },{
          title: "已付",
          dataIndex: "already_pay",
          width: "10%"
        },{
          title: "剩余应付",
          dataIndex: "surplus",
          width: "10%"
        },{
          title: "订单时间",
          dataIndex: "order_time",
          width: "25%"
        }
      ],
      purchasePayData: [],
      loadingData: true
    };
    this.setData();
  }

  setData() {
    getPurchasePayList().then(resp => {
      console.log("purchase order pay list: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          purchasePay_id: item.purchasePay_id,
          purchase_id: item.purchase_id,
          plan_total: item.plan_total,
          discount: item.discount,
          actual_total: item.actual_total,
          already_pay: item.already_pay,
          surplus: item.surplus,
          order_time: item.order_time
        });
      }
      this.setState({
        purchasePayData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取进货订单付款单失败！", 2);
    });
  }

  onSelectChangePurchasePay(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  render() {

    const pagination = {
      total: this.state.purchasePayData.length,
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
      onChange: this.onSelectChangePurchasePay.bind(this)
    }

    return (
      <Card
        title="进货付款单列表"
        extra={
          <div>

          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.purchasePayData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"purchasePay_id"}
        />
      </Card>
    )
  }
}

module.export = PurchasePayManagement;
