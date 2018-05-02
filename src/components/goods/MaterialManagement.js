/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Table, Collapse, Button, Modal, Input, message} from 'antd';

import {getMaterial, addMaterial} from '../../services/goodsApi';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

export default class MaterialManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawVisible: false,
      makingsVisible: false,
      //operationVisible: "none",
      operationVisible: window.sessionStorage.getItem("currentRole") === 6 ? "inline":"none",
      loadingRaw: true,
      loadingMakings: true,
      rawData: [],
      makingsData: [],
      selectedRawRowKeys: [],
      selectedMakingsRowKeys: [],
      column: [
        {
          title: "编号",
          dataIndex: "goodsId",
          sorter: (a, b) => a.goodsId - b.goodsId
        },{
          title: "类型",
          render:(record) => {
            let show = "原材料";
            if(record.goodsType === "2")
              show = "加工材料";
            return(<span>{show}</span>);
          },
          dataIndex: "goodsType"
        },{
          title: "名称",
          dataIndex: "goodsName"
        }
      ],

      addRawName: "",
      addMakingsName: ""
    };
  }

  setData(type) {
    let kind = type;
    getMaterial(type).then(resp => {
      console.log(resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          goodsId: item.goods_id,
          goodsType: item.goods_type,
          goodsName: item.goods_name
        });
      }
      if(kind === "1") {
        this.setState({
          rawData: v,
          loadingRaw: false
        });
      }
      if(kind === "2") {
        this.setState({
          makingsData: v,
          loadingMakings: false
        })
      }
    }).catch(() => {
      message.warning("数据获取失败！");
    });
  }

  onSelectChangeRaw(selectedRawRowKeys) {
    console.log("selectedRawRowKeys changed: ", selectedRawRowKeys);
    this.setState({selectedRawRowKeys});
  }
  onSelectChangeMakings(selectedMakingsRowKeys) {
    console.log("selectedMakingsRowKeys changed: ", selectedMakingsRowKeys);
    this.setState({selectedMakingsRowKeys});
  }

  getName(value,type) {
    console.log("new name: ", value);
    if(type === "1") {
      this.setState({
        addRawName: value
      });
    }
    if(type === "2") {
      this.setState({
        addMakingsName: value
      });
    }
  }

  handleSubmit(type) {
    let obj = {
      goods_type: type,
      goods_name: type === "1" ? this.state.addRawName : this.state.addMakingsName
    };
    addMaterial(obj).then(resp => {
      console.log("add material result: ", resp.data.entity);
      if(resp.data.entity.result === "ok") {
        message.success("添加成功，新增材料ID为：" + resp.data.entity.message, 5);
        this.setData(type);
        if(type === "1") {
          this.setState({rawVisible: false});
        }
        if(type === "2")
          this.setState({makingsVisible: false});
      }
    }).catch(() => {
      message.warning("添加失败！");
    });
  }
  handleCancel(type) {
    if(type === "1"){
      this.setState({
        rawVisible: false
      });
    }
    if(type === "2") {
      this.setState({
        makingsVisible: false
      });
    }
  }

  render() {

    const paginationRaw = {
      total: this.state.rawData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };
    const paginationMakings = {
      total: this.state.makingsData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    const {selectedRawRowKeys} = this.state;
    const {selectedMakingsRowKeys} = this.state;

    const rawSelection = {
      selectedRawRowKeys,
      onChange: this.onSelectChangeRaw.bind(this)
    };

    const makingsSelection = {
      selectedMakingsRowKeys,
      onChange: this.onSelectChangeMakings.bind(this)
    };

    return (
      <Card>
        <div>
          <Collapse bordered={false} defaultActiveKey={["1","2"]} style={{marginTop: 30}}>
            <Panel header="原料种类" key="1" style={customPanelStyle}>
              <Card
                title="原料列表"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.operationVisible}}
                      onClick={
                        () => {
                          this.setState({rawVisible:true});
                        }
                      }
                    >
                      增加原料
                    </Button>
                  </div>
                }
              >
                <Table
                  rowSelection={rawSelection}
                  columns={this.state.column}
                  dataSource={this.state.rawData}
                  bordered
                  pagination={paginationRaw}
                  scroll={{x: 1000, y: 1000}}
                  loading={this.state.loadingRaw}
                  rowKey={"goodsId"}
                />
                <Modal
                  visible={this.state.rawVisible}
                  title="新增原料"
                  destroyOnClose={true}
                  onOk={() => {this.handleSubmit("1")}}
                  onCancel={() => {this.handleCancel("1")}}
                  footer={[
                    <Button key="back" type="ghost" size="large" onClick={() => {this.handleCancel("1")}}>取消</Button>,
                    <Button key="submit" type="primary" size="large" onClick={() => {this.handleSubmit("1")}}>提交</Button>
                  ]}
                >
                  <Input id="rawName" onChange={value => this.getName(value.target.value, "1")}/>
                </Modal>
              </Card>
            </Panel>
            <Panel header="加工材料种类" key="2" style={customPanelStyle}>
              <Card
                title="加工材料列表"
                extra={
                  <div>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.operationVisible}}
                      onClick={
                        () => {
                          this.setState({makingsVisible:true});
                        }
                      }
                    >
                      增加加工材料
                    </Button>
                  </div>
                }
              >
                <Table
                  rowSelection={makingsSelection}
                  columns={this.state.column}
                  dataSource={this.state.makingsData}
                  bordered
                  pagination={paginationMakings}
                  scroll={{x: 1000, y: 1000}}
                  loading={this.state.loadingMakings}
                  rowKey={"goodsId"}
                />
                <Modal
                  visible={this.state.makingsVisible}
                  title="新增加工材料"
                  destroyOnClose={true}
                  onOk={() => {this.handleSubmit("2")}}
                  onCancel={() => {this.handleCancel("2")}}
                  footer={[
                    <Button key="back" type="ghost" size="large" onClick={() => {this.handleCancel("2")}}>取消</Button>,
                    <Button key="submit" type="primary" size="large" onClick={() => {this.handleSubmit("2")}}>提交</Button>
                  ]}
                >
                  <Input id="makingsName" onChange={value => this.getName(value.target.value, "2")}/>
                </Modal>
              </Card>
            </Panel>
          </Collapse>
        </div>
      </Card>
    )
  }
}

module.export = MaterialManagement;
