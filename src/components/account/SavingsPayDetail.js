/**
 * Created by dongc_000 on 2018/5/18.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {purchasePayDetailColumn} from './accountTable';
import {getSavingsPayDetailList} from '../../services/accountApi';

export default class SavingsPayDetail extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      detailData: [],
      loadingData: true,
      column: purchasePayDetailColumn()
    };
    this.setData();
  }

  setData() {
    let savingsId = window.sessionStorage.getItem("savings_look_detail_pay_id");
    getSavingsPayDetailList(savingsId).then(resp => {
      console.log("savings pay detail list: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          detail_id: item.detail_id,
          pay_id: item.pay_id,
          pay_money: item.pay_money,
          pay_time: item.pay_time,
          pay_user: item.pay_user,
          pay_savings: item.pay_savings
        });
      }
      this.setState({
        detailData: v,
        loadingData: false
      });
      window.sessionStorage.removeItem("savings_look_detail_pay_id");
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
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

    return(
      <Card
        title="账户付款详情"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  window.sessionStorage.removeItem("savings_look_detail_pay_id");
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

module.export = SavingsPayDetail;
