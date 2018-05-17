/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message, Modal, Input} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {purchaseStoreColumn} from './warehouseTable';
import {getPurchaseStoreListByGoods, fetchProcessMaterial} from '../../services/warehouseApi';
import {recordSampleUse} from '../../services/produceApi';

export default class MaterialStoreDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      column: purchaseStoreColumn(),
      storeDetailData: [],
      loadingData: true,
      selectedRowKeys: [],
      selectedRows: [],
      spendVisible: window.sessionStorage.getItem("sample_new_id") !== null ? 'inline':'none',
      spendRecord: false,
      spendNum: '',

      fetchVisible: window.sessionStorage.getItem("materialList_fetch_id") !== null ? 'inline':'none',
      fetchInput: false,
      fetchNum: ''
    };
    this.setData();
  }

  setData() {
    getPurchaseStoreListByGoods(window.sessionStorage.getItem("look_material_purchaseStore")).then(resp => {
      console.log("purchase store list of some goods: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          purchase_storeId: item.purchase_storeId,
          purchase_orderId: item.purchase_orderId,
          purchase_storeWarehouse: item.purchase_storeWarehouse,
          purchase_storeNum: item.purchase_storeNum,
          purchase_storePrice: item.purchase_storePrice,
          purchase_storeRemaining: item.purchase_storeRemaining,
          purchase_storeTime: item.purchase_storeTime,
          purchase_storeUser: item.purchase_storeUser
        });
      }
      this.setState({
        storeDetailData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    console.log("selectedRows changed: ", selectedRows);
    this.setState({selectedRowKeys, selectedRows});
  }

  beginToRecord() {
    let goods = this.state.selectedRowKeys;
    if(goods.length !== 1) {
      message.warning("请选择一种材料！", 2);
    } else {
      this.setState({
        spendRecord: true
      });
    }
  }

  handleRecordSubmit = () => {
    let obj = {
      use_sampleId: window.sessionStorage.getItem("sample_new_id"),
      use_purchaseStoreId: this.state.selectedRowKeys[0],
      use_num: this.state.spendNum,
      use_sampleUser: window.sessionStorage.getItem("userId")
    };
    recordSampleUse(obj).then(resp => {
      console.log("record num of the goods to use: ", resp.data.entity);
      if(resp.data.entity.result === 'ok') {
        message.success("记录成功！", 2);
        window.history.back();
      } else {
        message.warning("记录失败!", 2);
      }
    }).catch(() => {
      message.warning("记录失败!", 2);
    })
  };
  handleRecordCancel = () => {
    this.setState({spendRecord: false});
  };
  getNum(inValue) {
    console.log("spend num: ", inValue);
    this.setState({
      spendNum: inValue
    });
  }

  executeFetch() {
    let items = this.state.selectedRowKeys;
    if(items.length !== 1) {
      message.warning("请选择一项出库！", 2);
    } else {
      this.setState({
        fetchInput: true
      });
    }
  }
  getFetchInput(inValue) {
    console.log("fetch num: ", inValue);
    this.setState({
      fetchNum: inValue
    });
  }
  handleFetchSubmit = () => {
    let fetch_num = this.state.fetchNum;
    let need_remaining = window.sessionStorage.getItem("materialList_fetch_remaining");
    let store_remaining = this.state.selectedRows[0].purchase_storeRemaining;
    if(parseInt(fetch_num) > parseInt(need_remaining) || parseInt(fetch_num) > parseInt(store_remaining)) {
      //console.log(window.sessionStorage.getItem("materialList_fetch_remaining"));
      //console.log(this.state.selectedRows[0].purchase_storeRemaining);
      //console.log(this.state.fetchNum);
      message.warning("调度数量过多！", 2);
    } else {
      let obj = {
        use_listId: window.sessionStorage.getItem("materialList_fetch_id"),
        use_storeId: this.state.selectedRowKeys[0],
        use_num: this.state.fetchNum,
        use_user: window.sessionStorage.getItem("userId")
      };
      fetchProcessMaterial(obj).then(resp => {
        console.log("fetch material result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("加工材料调度成功!", 2);
          this.setState({fetchInput: false});
          window.sessionStorage.removeItem("materialList_fetch_id");
          window.sessionStorage.removeItem("materialList_fetch_goods");
          window.sessionStorage.removeItem("materialList_fetch_remaining");
          browserHistory.push({pathname: '/materialFetchManagement'});
        } else {
          message.warning("加工材料调度失败，请检查数量！", 2);
        }
      }).catch(() => {
        message.warning("加工材料调度失败！", 2);
      })
    }
  };
  handleFetchCancel = () => {
    this.setState({fetchInput: false});
  };

  render() {

    const pagination = {
      total: this.state.storeDetailData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    const {selectedRowKeys} = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    };

    return (
      <Card
        title="材料购买存储详情"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display: this.state.spendVisible}}
              onClick={
                () => {
                  this.beginToRecord()
                }
              }
            >
              确定消耗
            </Button>
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
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display: this.state.fetchVisible}}
              onClick={
                () => {
                  this.executeFetch()
                }
              }
            >
              加工出库
            </Button>
          </div>
        }
      >
        <Modal
          visible={this.state.spendRecord}
          title="记录消耗"
          onOk={() => {this.handleRecordSubmit()}}
          onCancel={() => {this.handleRecordCancel()}}
        >
          <Input id="recordNum" onChange={value => this.getNum(value.target.value)}/>
        </Modal>
        <Modal
          visible={this.state.fetchInput}
          title="加工出库"
          onOk={() => {this.handleFetchSubmit()}}
          onCancel={() => {this.handleFetchCancel()}}
        >
          <Input id="fetchNum" onChange={value => this.getFetchInput(value.target.value)}/>
        </Modal>
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.storeDetailData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"purchase_storeId"}
        />
      </Card>
    )
  }
}

module.export = MaterialStoreDetail;
