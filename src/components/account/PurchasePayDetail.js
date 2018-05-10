/**
 * Created by dongc_000 on 2018/5/8.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {getPurchasePayDetailList} from '../../services/accountApi';

export default class PurchasePayDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      column: [
        {
          title: "编号",
          dataIndex: "detail_id",
          width: "15%"
        },{
          title: "付款单",
          dataIndex: "pay_id",
          width: "15%"
        },{
          title: "付款金额",
          dataIndex: "pay_money",
          width: "15%"
        },{
          title: "付款时间",
          dataIndex: "pay_time",
          width: "20%"
        },{
          title: "付款账户",
          dataIndex: "pay_savings",
          width: "15%"
        },{
          title: "付款人ID",
          dataIndex: "pay_user",
          width: "15%"
        }
      ],
      detailData: [],
      loadingData: true
    };
    this.setData();
  }

  setData() {
    let purchasePayId = window.sessionStorage.getItem("look_payId");
    getPurchasePayDetailList(purchasePayId).then(resp => {
      console.log(resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          detail_id: item.detail_id,
          pay_id: item.pay_id,
          pay_money: item.pay_money,
          pay_savings: item.pay_savings,
          pay_time: item.pay_time,
          pay_user: item.pay_user
        });
      }
      this.setState({
        detailData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取详情列表失败！", 2);
    })
  }

  onSelectChangeDetail(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  render() {

    const pagination = {
      total: this.state.detailData.length,
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
      onChange: this.onSelectChangeDetail.bind(this)
    };

    return (
      <Card
        title="付款详情"
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
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.detailData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"detail_id"}
        />
      </Card>
    )
  }
}

module.export = PurchasePayDetail;
