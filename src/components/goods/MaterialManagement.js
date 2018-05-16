/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Table, Collapse, Button, Modal, Input, message, Form} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {getMaterial, addMaterial} from '../../services/goodsApi';
import {addSample, updateStateOfProcess, addProcessMaterialList} from '../../services/produceApi';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

const FormItem = Form.Item;
const SampleForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="拟定成品样本"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="加工描述">
            {getFieldDecorator('procedureDescription',{
              rules: [{required: true, message: '请输入加工成分描述信息！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="材料成本">
            {getFieldDecorator('procedureMaterialCost',{
              rules: [{required: true, message: '请输入材料成本！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="加工成本">
            {getFieldDecorator('procedureProcessCost',{
              rules: [{required: true, message: '请输入加工过程成本！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="人力成本">
            {getFieldDecorator('procedureHumanCost',{
              rules: [{required: true, message: '请输入人力成本！'}],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

export default class MaterialManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawVisible: false,
      makingsVisible: false,
      //operationVisible: "none",
      operationVisible: window.sessionStorage.getItem("currentRole") === "6" ? "inline":"none",
      chooseVisible: window.sessionStorage.getItem("currentRole") === "4" ? "inline":"none",
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
          width: "33%",
          sorter: (a, b) => a.goodsId - b.goodsId
        },{
          title: "类型",
          render:(record) => {
            let show = "原材料";
            if(record.goodsType === "2")
              show = "加工材料";
            return(<span>{show}</span>);
          },
          width: "33%",
          dataIndex: "goodsType"
        },{
          title: "名称",
          width: "33%",
          dataIndex: "goodsName"
        }
      ],

      addRawName: "",
      addMakingsName: "",

      //打样参考
      sampleVisible: window.sessionStorage.getItem("currentRole") === '6' && window.sessionStorage.getItem("product_id") !== null ? 'inline':'none',
      sampleUseVisible: window.sessionStorage.getItem("sample_new_id") !== null ? 'inline':'none',//打样消耗
      newSampleVisible: false,

      //增加加工材料单
      processMaterialVisible: window.sessionStorage.getItem("process_prepare_id") !== null ? 'inline':'none',
      processMaterialNumVisible: false,
      processMaterialNum: '',
      processMaterialKind: ''
    };
    this.setData("1");
    this.setData("2");
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

  chooseOneToBuy(type) {
    if(type === "1") {
      if(this.state.selectedRawRowKeys.length !== 1) {
        message.warning("请确定选择一项货物！",2);
      } else {
        window.sessionStorage.setItem("newBuyMaterial",this.state.selectedRawRowKeys[0]);
      }
    } else {
      if(this.state.selectedMakingsRowKeys.length !== 1) {
        message.warning("请确定选择一项货物！",2);
      } else {
        window.sessionStorage.setItem("newBuyMaterial",this.state.selectedMakingsRowKeys[0]);
      }
    }
    window.sessionStorage.setItem("newBuyOrder", type);
    browserHistory.push({pathname: '/customerChoose'});
  }

  cancelCrateBuyOrder() {
    window.sessionStorage.removeItem("newBuyMaterial");
    window.sessionStorage.removeItem("newBuyOrder");
    window.history.back();
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

  lookMaterialStoreDetail(type) {
    let goods = [];
    if(type === '1') {
      goods = this.state.selectedRawRowKeys;
    }
    if(type === '2') {
      goods = this.state.selectedMakingsRowKeys;
    }
    if(goods.length !== 1) {
      message.warning("请选择一个要查看的材料！", 2);
    } else {
      window.sessionStorage.setItem("look_material_purchaseStore", goods[0]);
      browserHistory.push({pathname: '/materialStoreDetail'});
    }
  }

  useGoodsRecord(type) {

  }

  saveFormRef = (form) => {
    this.form = form;
  };
  handleSampleCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      let obj = {
        sample_productId: window.sessionStorage.getItem("product_id"),
        sample_description: values.procedureDescription,
        sample_materialCost: values.procedureMaterialCost,
        sample_processCost: values.procedureProcessCost,
        sample_humanCost: values.procedureHumanCost,
        sample_userId: window.sessionStorage.getItem("userId")
      };
      addSample(obj).then(resp => {
        console.log("add sample result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("增加样本成功，请记录打样消耗！", 5);
          window.sessionStorage.setItem("sample_new_id", resp.data.entity.message);
          this.setState({sampleUseVisible: 'inline'});
        } else {
          message.warning("增加样本失败！", 2);
        }
      }).catch(() => {
        message.warning("增加样本失败！", 2);
      })
    })
  };
  handleSampleCancel = () => {
    this.setState({newSampleVisible: false});
    window.history.back();
  };

  confirmMaterialList() {
    let obj = {
      process_id: window.sessionStorage.getItem("process_prepare_id"),
      process_state: '2'
    };
    updateStateOfProcess(obj).then(resp => {
      console.log("confirm material lists of process result: ", resp.data.entity);
      if(resp.data.entity.result === 'ok') {
        message.success("确认材料单成功！", 2);
        window.sessionStorage.removeItem("process_prepare_id");
        browserHistory.push({pathname: '/produceMaterial'});
      }
    }).catch(() => {
      message.warning("确认加工所需全部材料单失败！", 2);
    })
  }
  confirmNeed(type){
    let items = [];
    if(type === '1')
      items = this.state.selectedRawRowKeys;
    if(type === '2')
      items = this.state.selectedMakingsRowKeys;
    if(items.length !== 1) {
      message.warning("请选择一种材料！", 2);
    } else {
      this.setState({
        processMaterialKind: items[0],
        processMaterialNumVisible: true
      });
    }
  }
  getMaterialNum(inValue) {
    console.log("material required num: ", inValue);
    this.setState({processMaterialNum: inValue});
  }
  handleMaterialNumSubmit = () => {
    let obj = {
      list_process: window.sessionStorage.getItem("process_prepare_id"),
      list_goods: this.state.processMaterialKind,
      list_total: this.state.processMaterialNum,
      list_state: '3'
    };
    addProcessMaterialList(obj).then(resp => {
      console.log("add process material list result: ", resp.data.entity);
      if(resp.data.entity.result === 'ok') {
        message.success("增加加工材料单成功！", 2);
      } else {
        message.warning("增加加工材料单失败！", 2);
      }
      this.setState({processMaterialNumVisible: false});
    }).catch(() => {
      message.warning("增加加工材料单失败！", 2);
    })
  };
  handleMaterialNumCancel = () => {
    this.setState({processMaterialNumVisible: false});
  };

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
      <Card
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.sampleVisible}}
              onClick={
                () => {
                  this.setState({newSampleVisible: true});
                }
              }
            >
              拟定样本
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.processMaterialVisible}}
              onClick={
                () => {
                  this.confirmMaterialList()
                }
              }
            >
              完成材料单
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.processMaterialVisible}}
              onClick={
                () => {
                  window.sessionStorage.removeItem("process_prepare_id");
                  window.history.back();
                }
              }
            >
              返回
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.sampleUseVisible}}
              onClick={
                () => {
                  window.sessionStorage.removeItem("sample_new_id");
                  browserHistory.push({pathname: '/productSampleList'});
                }
              }
            >
              记录完成
            </Button>
          </div>
        }
      >
        <div>
          <SampleForm
            ref={this.saveFormRef}
            visible={this.state.newSampleVisible}
            onCancel={this.handleSampleCancel}
            onCreate={this.handleSampleCreate}
          />
          <Modal
            visible={this.state.processMaterialNumVisible}
            title="需求数量"
            onOk={() => {this.handleMaterialNumSubmit()}}
            onCancel={() => {this.handleMaterialNumCancel()}}
          >
            <Input id="materialNum" onChange={value => this.getMaterialNum(value.target.value)}/>
          </Modal>
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
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.chooseVisible}}
                      onClick={
                        () => {
                          //this.setState({rawVisible:true});
                          this.chooseOneToBuy("1");
                        }
                      }
                    >
                      下一步
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.chooseVisible}}
                      onClick={
                        () => {
                          //window.history.back();
                          this.cancelCrateBuyOrder();
                        }
                      }
                    >
                      返回
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.sampleVisible}}
                      onClick={
                        () => {
                          this.lookMaterialStoreDetail('1')
                        }
                      }
                    >
                      查看存储
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.sampleUseVisible}}
                      onClick={
                        () => {
                          //this.useGoodsRecord('1')
                          this.lookMaterialStoreDetail('1')
                        }
                      }
                    >
                      增加消耗
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.processMaterialVisible}}
                      onClick={
                        () => {
                          this.confirmNeed('1')
                        }
                      }
                    >
                      确定需要
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
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.chooseVisible}}
                      onClick={
                        () => {
                          //this.setState({rawVisible:true});
                          this.chooseOneToBuy("2");
                        }
                      }
                    >
                      下一步
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.chooseVisible}}
                      onClick={
                        () => {
                          //window.history.back();
                          this.cancelCrateBuyOrder();
                        }
                      }
                    >
                      返回
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.sampleVisible}}
                      onClick={
                        () => {
                          this.lookMaterialStoreDetail('2')
                        }
                      }
                    >
                      查看存储
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.sampleUseVisible}}
                      onClick={
                        () => {
                          //this.useGoodsRecord('2')
                          this.lookMaterialStoreDetail('2')
                        }
                      }
                    >
                      增加消耗
                    </Button>
                    <Button
                      style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.processMaterialVisible}}
                      onClick={
                        () => {
                          this.confirmNeed('2')
                        }
                      }
                    >
                      确定需要
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
