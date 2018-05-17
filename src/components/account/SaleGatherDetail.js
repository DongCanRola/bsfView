/**
 * Created by dongc_000 on 2018/5/8.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {getSaleGatherDetailList} from '../../services/accountApi';

export default class SaleGatherDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      detailData: [],
      loadingData: true,
      column: [
        {
          title: "编号",
          dataIndex: "detail_id",
          width: "15%"
        },{
          title: "收款单",
          dataIndex: "detail_gather",
          width: "15%"
        },{
          title: "金额",
          dataIndex: "detail_money",
          width: "15%"
        },{
          title: "时间",
          dataIndex: "detail_time",
          width: "20%"
        },{
          title: "账户",
          dataIndex: "detail_savings",
          width: "15%"
        },{
          title: "收款人",
          dataIndex: "detail_user",
          width: "15%"
        }
      ]
    };
    this.setData();
  }

  setData() {
    let gather = window.sessionStorage.getItem("look_gatherId");
    getSaleGatherDetailList(gather).then(resp => {
      console.log("sale gather detail lists: ", resp.data.entity);
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

    return(
      <Card
        title="收款详情"
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

module.export = SaleGatherDetail;
