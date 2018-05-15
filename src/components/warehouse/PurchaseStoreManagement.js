/**
 * Created by dongc_000 on 2018/5/15.
 */
import React from 'react';
import {Card, Table, Button, message, Collapse, Modal, Input} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {getOrdersByState} from '../../services/purchaseApi';
import {storePurchase} from '../../services/warehouseApi';
import {purchaseStoringColumn, purchaseStoredColumn} from './warehouseTable';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

export default class PurchaseStoreManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      doingData: [],
      loadingDoing: true,
      doneData: [],
      loadingDone: true,
      selectedDoingRowKeys: [],
      selectedDoingRows: [],
      selectedDoneRowKeys: [],
      selectedDoneRows: [],
      doingColumn: purchaseStoringColumn(),
      doneColumn: purchaseStoredColumn(),

      storeVisible: window.sessionStorage.getItem("purchase_store_warehouse") !== null && window.sessionStorage.getItem("warehouse_spare") !== null,
      remainingNum: '',
      storeNum: ''
    };
    this.setData('3');
    this.setData('4');
  }

  setData(type) {
    getOrdersByState(type).then(resp => {
      console.log("purchase orders: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          purchaseOrder_id: item.purchaseOrder_id,
          purchaseGoods_id: item.purchaseGoods_id,
          purchaseGoods_name: item.purchaseGoods_name,
          purchase_num: item.purchase_num,
          purchase_time: item.purchase_time,
          wait_store: item.wait_store
        });
      }
      if(type === '3') {
        this.setState({
          doingData: v,
          loadingDoing: false
        });
      } else {
        this.setState({
          doneData: v,
          loadingDone: false
        });
      }
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
  }

  onDoingSelectChange(selectedDoingRowKeys, selectedDoingRows) {
    console.log("selectedDoingRowKeys changed: ", selectedDoingRowKeys);
    console.log("selectedDoingRows changed: ", selectedDoingRows);
    this.setState({selectedDoingRowKeys, selectedDoingRows});
  }
  onDoneSelectChange(selectedDoneRowKeys, selectedDoneRows) {
    console.log("selectedDoneRowKeys changed: ", selectedDoneRowKeys);
    console.log("selectedDoneRows changed: ", selectedDoneRows);
    this.setState({selectedDoneRowKeys, selectedDoneRows});
  }

  lookPurchaseStoreDetail(type) {
    let order = [];
    if(type === '3') {
      order = this.state.selectedDoingRowKeys;
    }
    if(type === '4') {
      order = this.state.selectedDoneRowKeys;
    }
    window.sessionStorage.setItem("look_purchaseStore", order[0]);
    browserHistory.push({pathname: '/purchaseStoreDetail'});
  }

  storePurchase() {
    let order = this.state.selectedDoingRows;
    if(order.length !== 1) {
      message.warning("请选择一个订单进行存储操作！", 2);
    } else {
      window.sessionStorage.setItem("purchase_store_order_id", order[0].purchaseOrder_id);
      window.sessionStorage.setItem("purchase_wait_store", order[0].wait_store);
      browserHistory.push({pathname: '/warehouseManagement'});
    }
  }

  getStoreNum(inValue) {
    console.log("store num: ", inValue);
    this.setState({
      storeNum: inValue
    });
  }
  handleStoreSubmit = () => {
    let warehouse_spare = window.sessionStorage.getItem("warehouse_spare");
    let purchase_wait = window.sessionStorage.getItem("purchase_wait_store");
    let store_num = this.state.storeNum;
    if(store_num > warehouse_spare || store_num > purchase_wait) {
      message.warning("存入数量过多！", 2);
    } else {
      let obj = {
        purchase_orderId: window.sessionStorage.getItem("purchase_store_order_id"),
        purchase_storeWarehouse: window.sessionStorage.getItem("purchase_store_warehouse"),
        purchase_storeNum: store_num,
        purchase_storeRemaining: store_num,
        purchase_storeUser: window.sessionStorage.getItem("userId")
      };
      storePurchase(obj).then(resp => {
        console.log("store purchase result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("存储成功，存储分配单ID为"+resp.data.entity.message, 2);
          this.setData('3');
          this.setData('4');
          window.sessionStorage.removeItem("purchase_store_order_id");
          window.sessionStorage.removeItem("purchase_wait_store");
          window.sessionStorage.removeItem("purchase_store_warehouse");
          window.sessionStorage.removeItem("warehouse_spare");
          this.setState({storeVisible: false});
        } else {
          message.warning("存储失败，存储数量不合理，请修改!", 2);
        }
      }).catch(() => {
        message.warning("存储失败！", 2);
        window.sessionStorage.removeItem("purchase_store_order_id");
        window.sessionStorage.removeItem("purchase_wait_store");
        window.sessionStorage.removeItem("purchase_store_warehouse");
        window.sessionStorage.removeItem("warehouse_spare");
        this.setState({storeVisible: false});
      })
    }
  };
  handleStoreCancel = () => {
    window.sessionStorage.removeItem("purchase_store_order_id");
    window.sessionStorage.removeItem("purchase_wait_store");
    window.sessionStorage.removeItem("purchase_store_warehouse");
    window.sessionStorage.removeItem("warehouse_spare");
    this.setState({storeVisible: false});
  };

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
      onChange: this.onDoingSelectChange.bind(this)
    };
    const doneSelection = {
      selectedDoneRowKeys,
      onChange: this.onDoneSelectChange.bind(this)
    };

    return(
      <Collapse bordered={false} defaultActiveKey={["1"]} style={{marginTop: 30}}>
        <Panel header="待入库" key="1" style={customPanelStyle}>
          <Card
            title="待入库进货单"
            extra={
              <div>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      this.storePurchase()
                    }
                  }
                >
                  入库
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      this.lookPurchaseStoreDetail('3');
                    }
                  }
                >
                  查看详情
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
              rowKey={"purchaseOrder_id"}
            />
            <Modal
              visible={this.state.storeVisible}
              title={"存入"+window.sessionStorage.getItem("purchase_store_warehouse")+",可用空间"+window.sessionStorage.getItem("warehouse_spare")}
              onOk={() => {this.handleStoreSubmit()}}
              onCancel={() => {this.handleStoreCancel()}}
            >
              <p>{"订单"+window.sessionStorage.getItem("purchase_store_order_id")+"有"+window.sessionStorage.getItem("purchase_wait_store")+"待存储"}</p>
              <Input id="numToStore" onChange={value => this.getName(value.target.value)}/>
            </Modal>
          </Card>
        </Panel>
        <Panel header="已入库" key="2" style={customPanelStyle}>
          <Card
            title="入库完成进货单"
            extra={
              <div>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      this.lookPurchaseStoreDetail('4');
                    }
                  }
                >
                  查看详情
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
              rowKey={"purchaseOrder_id"}
            />
          </Card>
        </Panel>
      </Collapse>
    )
  }
}

module.export = PurchaseStoreManagement;
