/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message, Collapse} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {processMaterialColumn} from '../producer/produceTable';
import {getMaterialListByState} from '../../services/produceApi';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

export default class MaterialFetchManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      waitData: [],
      loadingWait: true,
      waitColumn: processMaterialColumn(),
      selectedWaitRowKeys: [],
      selectedWaitRows: [],

      doneData: [],
      loadingDone: true,
      doneColumn: processMaterialColumn(),
      selectedDoneRowKeys: [],
      selectedDoneRows: []
    };
    this.setData('1');
    this.setData('2');
  }

  setData(type) {
    getMaterialListByState(type).then(resp => {
      console.log("get material lists by state: ", resp.data.entity);
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
      if(type === '1') {
        this.setState({
          waitData: v,
          loadingWait: false
        });
      }
      if(type === '2') {
        this.setState({
          doneData: v,
          loadingDone: false
        });
      }
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
  }

  onSelectWaitChange(selectedWaitRowKeys, selectedWaitRows) {
    console.log("selectedWaitRowKeys changed: ", selectedWaitRowKeys);
    console.log("selectedWaitRows changed: ", selectedWaitRows);
    this.setState({selectedWaitRowKeys, selectedWaitRows});
  }
  onSelectDoneChange(selectedDoneRowKeys, selectedDoneRows) {
    console.log("selectedDoneRowKeys changed: ", selectedDoneRowKeys);
    console.log("selectedDoneRows changed: ", selectedDoneRows);
    this.setState({selectedDoneRowKeys, selectedDoneRows});
  }

  lookFetchDetail(type) {
    let items = [];
    if(type === '1')
      items = this.state.selectedWaitRowKeys;
    if(type === '2')
      items = this.state.selectedDoneRowKeys;
    window.sessionStorage.setItem("list_lookDetail_id", items[0]);
    browserHistory.push({pathname: '/materialFetchDetail'});
  }

  fetchMaterial() {
    let items = this.state.selectedWaitRows;
    if(items.length !== 1) {
      message.warning("请选择一个待调度材料单！", 2);
    } else {
      window.sessionStorage.setItem("materialList_fetch_id", items[0].list_id);
      window.sessionStorage.setItem("materialList_fetch_goods", items[0].list_goods);
      window.sessionStorage.setItem("materialList_fetch_remaining", items[0].list_remaining);
      browserHistory.push({pathname: '/materialStoreDetail'});
    }
  }

  render() {

    const paginationWait = {
      total: this.state.waitData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };
    const paginationDone = {
      total: this.state.doneData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    const {selectedWaitRowKeys} = this.state;
    const {selectedDoneRowKeys} = this.state;

    const waitSelection = {
      selectedWaitRowKeys,
      onChange: this.onSelectWaitChange.bind(this)
    };
    const doneSelection = {
      selectedDoneRowKeys,
      onChange: this.onSelectDoneChange.bind(this)
    };

    return (
      <Card>
        <div>
          <Collapse bordered={false} defaultActiveKey={["1","2"]} style={{marginTop: 30}}>
            <Panel header="未调度" key="1" style={customPanelStyle}>
              <Card
                title="加工材料单"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.fetchMaterial()
                        }
                      }
                    >
                      调度
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.lookFetchDetail('1')
                        }
                      }
                    >
                      调度详情
                    </Button>
                  </div>
                }
              >
                <Table
                  rowSelection={waitSelection}
                  columns={this.state.waitColumn}
                  dataSource={this.state.waitData}
                  bordered
                  pagination={paginationWait}
                  scroll={{x: 1000, y: 1000}}
                  loading={this.state.loadingWait}
                  rowKey={"list_id"}
                />
              </Card>
            </Panel>
            <Panel header="已出库" key="2" style={customPanelStyle}>
              <Card
                title="加工材料单"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.lookFetchDetail('2')
                        }
                      }
                    >
                      调度详情
                    </Button>
                  </div>
                }
              >
                <Table
                  rowSelection={doneSelection}
                  columns={this.state.doneColumn}
                  dataSource={this.state.doneData}
                  bordered
                  pagination={paginationDone}
                  scroll={{x: 1000, y: 1000}}
                  loading={this.state.loadingDone}
                  rowKey={"list_id"}
                />
              </Card>
            </Panel>
          </Collapse>
        </div>
      </Card>
    )
  }
}

module.export = MaterialFetchManagement;
