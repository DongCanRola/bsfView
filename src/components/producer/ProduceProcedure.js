/**
 * Created by dongc_000 on 2018/5/15.
 */
import React from 'react';
import {Card, Table, Modal, Button, message, Collapse} from 'antd';

import {processColumn} from './produceTable';
import {getProcessByState, getConcreteSample, updateStateOfProcess} from '../../services/produceApi';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

export default class ProduceProcedure extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      doingData: [],
      doingColumn: processColumn(),
      loadingDoing: true,
      selectedDoingRowKeys: [],
      selectedDoingRows: [],
      doneData: [],
      doneColumn: processColumn(),
      loadingDone: true,
      selectedDoneRowKeys: [],
      selectedDoneRows: []
    };
    this.setData('4');
    this.setData('5');
  }

  setData(type) {
    getProcessByState(type).then(resp => {
      console.log("process list: ", resp.data.entity);
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
      if(type === '4') {
        this.setState({
          doingData: v,
          loadingDoing: false
        });
      }
      if(type === '5') {
        this.setState({
          doneData: v,
          loadingDone: false
        });
      }
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
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

  completeProduce() {
    let items = this.state.selectedDoingRowKeys;
    if(items.length !== 1) {
      message.warning("请完成一项加工！", 2);
    } else {
      let obj = {
        process_id: items[0],
        process_state: '5'
      };
      updateStateOfProcess(obj).then(resp => {
        console.log("result of update process: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("加工完成！", 2);
          this.setData('4');
          this.setData('5');
        }
      }).catch(() => {
        message.warning("加工完成失败！", 2);
      })
    }
  }

  sampleInfo(type) {
    let items = [];
    if(type === '4')
      items = this.state.selectedDoingRows;
    if(type === '5')
      items = this.state.selectedDoneRows;
    if(items.length !== 1) {
      message.warning("请选择一个进行查看!", 2);
    } else {
      getConcreteSample(items[0].sample_id).then(resp => {
        console.log("get some sample: ", resp.data.entity);
        let currentSample = resp.data.entity[0];
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
  }

  render() {

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

    const {selectedDoingRowKeys} = this.state;
    const {selectedDoneRowKeys} = this.state;

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
          <Collapse bordered={false} defaultActiveKey={["1","2"]} style={{marginTop: 30}}>
            <Panel header="加工中" key="1" style={customPanelStyle}>
              <Card
                title="加工处理列表"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.completeProduce()
                        }
                      }
                    >
                      完成
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.sampleInfo('4')
                        }
                      }
                    >
                      查看样本
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
            <Panel header="加工完成" key="2" style={customPanelStyle}>
              <Card
                title="加工处理列表"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10}}
                      onClick={
                        () => {
                          this.sampleInfo('4')
                        }
                      }
                    >
                      查看样本
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

module.export = ProduceProcedure;
