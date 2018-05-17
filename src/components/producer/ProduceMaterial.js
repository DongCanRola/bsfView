/**
 * Created by dongc_000 on 2018/5/15.
 */
import React from 'react';
import {Card, Table, message, Button, Collapse, Modal} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {processColumn} from './produceTable';
import {getProcessByState, updateStateOfProcess, getConcreteSample} from '../../services/produceApi';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

export default class ProduceMaterial extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      waitData: [],
      loadingWait: true,
      waitColumn: processColumn(),
      selectedWaitRowKeys: [],
      selectedWaitRows: [],

      doingData: [],
      loadingDoing: true,
      doingColumn: processColumn(),
      selectedDoingRowKeys: [],
      selectedDoingRows: [],

      doneData: [],
      loadingDone: true,
      doneColumn: processColumn(),
      selectedDoneRowKeys: [],
      selectedDoneRows: []
    };
    this.setData('6');
    this.setData('2');
    this.setData('3');
  }

  setData(type) {
    getProcessByState(type).then(resp => {
      console.log("get process by state: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          process_id: item.process_id,
          sale_orderId: item.sale_orderId,
          sample_id: item.sample_id,
          process_productNum: item.process_productNum,
          process_userId: item.process_userId
        });
      }
      if(type === '6') {
        this.setState({
          waitData: v,
          loadingWait: false
        });
      }
      if(type === '2') {
        this.setState({
          doingData: v,
          loadingDoing: false
        });
      }
      if(type === '3') {
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
  onSelectDoingChange(selectedDoingRowKeys, selectedDoingRows) {
    console.log("selectedDoingRowKeys changed: ", selectedDoingRowKeys);
    console.log("selectedDoingRows changed: ", selectedDoingRows);
    this.setState({selectedDoingRowKeys, selectedDoingRows});
  }
  onSelectDoneChange(selectedDoneRowKeys, selectedDoneRows) {
    console.log("selectedDoneRowKeys changed: ", selectedDoneRowKeys);
    console.log("selectedDoneRows changed: ", selectedDoneRows);
    this.setState({selectedDoneRowKeys, selectedDoneRows});
  }

  sampleInfo(type) {
    let items = [];
    if(type === '6')
      items = this.state.selectedWaitRows;
    if(type === '2')
      items = this.state.selectedDoingRows;
    if(type === '3')
      items = this.state.selectedDoneRows;
    getConcreteSample(items[0].sample_id).then(resp => {
      console.log("get some sample: ", resp.data.entity);
      let currentSample = resp.data.entity;
      console.log("the sample: ", currentSample);
      Modal.info({
        title: '样本'+currentSample.sample_id,
        content: (
          <div>
            <p>{"成品"+currentSample.sample_productId}</p>
            <p>{currentSample.sample_description}</p>
            <p>{"材料成本"+currentSample.sample_materialCost}</p>
            <p>{"过程成本"+currentSample.sample_processCost}</p>
            <p>{"人力成本"+currentSample.sample_humanCost}</p>
          </div>
        ),
        onOK() {},
      });
    }).catch(() => {
      message.warning("获取样本信息失败!", 2);
    })
  }

  prepareMaterial() {
    let items = this.state.selectedWaitRowKeys;
    if(items.length !== 1) {
      message.warning("请选择一个要拟定材料单的加工项！", 2);
    } else {
      window.sessionStorage.setItem("process_prepare_id", items[0]);
      browserHistory.push({pathname: '/materialManagement'});
    }
  }

  lookMaterialList(type) {
    let items = [];
    if(type === '6')
      items = this.state.selectedWaitRowKeys;
    if(type === '2')
      items = this.state.selectedDoingRowKeys;
    if(type === '3')
      items = this.state.selectedDoneRowKeys;
    window.sessionStorage.setItem("process_materialList_look_id", items[0]);
    browserHistory.push({pathname: '/processMaterialList'});
  }

  beginProduce() {
    let items = this.state.selectedDoneRowKeys;
    for(let item of items) {
      let obj = {
        process_id: item,
        process_state: '4'
      };
      updateStateOfProcess(obj).then(resp => {
        console.log("begin process result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("成功进入加工！", 2);
          this.setData('3');
        } else {
          message.success("操作失败！", 2);
        }
      }).catch(() => {
        message.warning("进入加工失败！", 2);
      })
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
    const paginationDoing = {
      total: this.state.doingData.length,
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
    const {selectedDoingRowKeys} = this.state;
    const {selectedDoneRowKeys} = this.state;

    const waitSelection = {
      selectedWaitRowKeys,
      onChange: this.onSelectWaitChange.bind(this)
    };
    const doingSelection = {
      selectedDoingRowKeys,
      onChange: this.onSelectDoingChange.bind(this)
    };
    const doneSelection = {
      selectedDoneRowKeys,
      onChange: this.onSelectDoneChange.bind(this)
    };

    return (
      <Card>
        <div>
          <Collapse bordered={false} defaultActiveKey={["1","2","3"]} style={{marginTop: 30}}>
            <Panel header="拟定材料单" key="1" style={customPanelStyle}>
              <Card
                title="加工条目列表"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.sampleInfo('6')
                        }
                      }
                    >
                      查看样本
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.prepareMaterial()
                        }
                      }
                    >
                      增加材料单
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.lookMaterialList('6')
                        }
                      }
                    >
                      查看材料单
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
                  rowKey={"process_id"}
                />
              </Card>
            </Panel>
            <Panel header="材料准备中" key="2" style={customPanelStyle}>
              <Card
                title="加工条目列表"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.sampleInfo('2')
                        }
                      }
                    >
                      查看样本
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.lookMaterialList('2')
                        }
                      }
                    >
                      查看材料单
                    </Button>
                  </div>
                }
              >
                <Table
                  rowSelection={doingSelection}
                  columns={this.state.doingColumn}
                  dataSource={this.state.doingData}
                  bordered
                  pagination={paginationDoing}
                  scroll={{x: 1000, y: 1000}}
                  loading={this.state.loadingDoing}
                  rowKey={"process_id"}
                />
              </Card>
            </Panel>
            <Panel header="材料准备完成" key="3" style={customPanelStyle}>
              <Card
                title="加工条目列表"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.sampleInfo('3')
                        }
                      }
                    >
                      查看样本
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.lookMaterialList('3')
                        }
                      }
                    >
                      查看材料单
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.beginProduce()
                        }
                      }
                    >
                      开始加工
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
                  rowKey={"process_id"}
                />
              </Card>
            </Panel>
          </Collapse>
        </div>
      </Card>
    )
  }
}

module.export = ProduceMaterial;
