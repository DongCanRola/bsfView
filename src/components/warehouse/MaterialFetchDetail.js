/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {processMaterialFetchColumn} from './warehouseTable';
import {getMaterialUseListByProcessOrder} from '../../services/warehouseApi';

export default class MaterialFetchDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      loadingData: true,
      listColumn: processMaterialFetchColumn()
    };
    this.setData();
  }

  setData() {
    getMaterialUseListByProcessOrder(window.sessionStorage.getItem("list_lookDetail_id")).then(resp => {
      console.log("get list of the material that the process order use: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          use_id: item.use_id,
          use_listId: item.use_listId,
          use_storeId: item.use_storeId,
          use_num: item.use_num,
          use_time: item.use_time,
          use_user: item.use_user
        });
      }
      this.setState({
        listData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取数据失败!", 2);
    })
  }

  render() {

    const pagination = {
      total: this.state.listData.length,
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
        title="加工材料调度列表"
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
          columns={this.state.listColumn}
          dataSource={this.state.listData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"use_id"}
        />
      </Card>
    )
  }
}

module.export = MaterialFetchDetail;
