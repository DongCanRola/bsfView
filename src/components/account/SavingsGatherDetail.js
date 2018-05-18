/**
 * Created by dongc_000 on 2018/5/18.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {saleGatherDetailColumn} from './accountTable';
import {getSavingsGatherDetailList} from '../../services/accountApi';

export default class SavingsGatherDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detailData: [],
      loadingData: true,
      column: saleGatherDetailColumn()
    };
    this.setData();
  }

  setData() {
    let savingsId = window.sessionStorage.getItem("savings_look_detail_gather_id");
    getSavingsGatherDetailList(savingsId).then(resp => {
      console.log("savings gather detail list: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          detail_id: item.detail_id,
          detail_gather: item.detail_gather,
          detail_money: item.detail_money,
          detail_time: item.detail_time,
          detail_user: item.detail_user,
          detail_savings: item.detail_savings
        });
      }
      this.setState({
        detailData: v,
        loadingData: false
      });
      window.sessionStorage.removeItem("savings_look_detail_gather_id");
    }).catch(() => {
      message.warning("数据获取失败！", 2);
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

    return (
      <Card
        title="账户收款详情"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  window.sessionStorage.removeItem("savings_look_detail_gather_id");
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

module.export = SavingsGatherDetail;
