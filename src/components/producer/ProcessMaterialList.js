/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';

import {processMaterialColumn} from './produceTable';
import {getMaterialListByProcess} from '../../services/produceApi';

export default class ProcessMaterialList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      listColumn: processMaterialColumn(),
      loadingData: true
    };
    this.setData();
  }

  setData() {
    getMaterialListByProcess(window.sessionStorage.getItem("process_materialList_look_id")).then(resp => {
      console.log("get material lists of process result: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          list_id: item.list_id,
          list_process: item.list_process,
          list_goods: item.list_goods,
          list_total: item.list_total,
          list_remaining: item.list_remaining,
          list_state: item.list_state,
          list_time: item.list_time
        });
      }
      this.setState({
        listData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取数据失败！", 2);
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
        title="加工材料单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  window.sessionStorage.removeItem("process_materialList_look_id");
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
          rowKey={"list_id"}
        />
      </Card>
    )

  }

}

module.export = ProcessMaterialList;
