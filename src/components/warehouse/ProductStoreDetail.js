/**
 * Created by dongc_000 on 2018/5/16.
 */
import React from 'react';
import {Card, Table, Button, message, Modal, Input} from 'antd';

import {getProductStoreBySale, sendProduct} from '../../services/warehouseApi';
import {productStoreColumn} from './warehouseTable';

export default class ProductStoreDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      storeData: [],
      column: productStoreColumn(),
      loadingData: true,
      lookSale: window.sessionStorage.getItem("sale_store_look_order_id"),

      selectedRowKeys: [],
      selectedRows: [],
      sendVisible: window.sessionStorage.getItem("sale_send") !== null ? 'inline':'none',
      sendNumVisible: false,
      sendNum: '',
      send_store_id: '',
      send_store_remaining: ''
    };
    this.setData();
  }

  setData() {
    getProductStoreBySale(this.state.lookSale).then(resp => {
      console.log("sale store detail: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          store_id: item.store_id,
          store_saleId: item.store_saleId,
          store_warehouseId: item.store_warehouseId,
          store_num: item.store_num,
          store_remaining: item.store_remaining,
          store_time: item.store_time,
          store_user: item.store_user
        });
      }
      this.setState({
        storeData: v,
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

  sendStore() {
    let items = this.state.selectedRows;
    if(items.length !== 1) {
      message.warning("请选择要出库的存储项！", 2);
    } else {
      this.setState({
        sendNumVisible: true,
        send_store_id: items[0].store_id,
        send_store_remaining: items[0].store_remaining
      });
    }
  }

  getSendNum(inValue) {
    console.log("send num: ", inValue);
    this.setState({sendNum: inValue});
  }
  handleSendSubmit = () => {
    let send_num = this.state.sendNum;
    let store_remain = this.state.selectedRows[0].store_remaining;
    if(parseInt(send_num) > parseInt(store_remain)) {
      message.warning("数量过多！", 2);
    } else {
      let obj = {
        send_storeId: this.state.selectedRows[0].store_id,
        send_num: send_num,
        send_user: window.sessionStorage.getItem("userId")
      };
      sendProduct(obj).then(resp => {
        console.log("send product result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("记录发货成功！", 2);
          this.setData();
          this.setState({sendNumVisible: false});
        } else {
          message.warning("请检查发货数量！", 2);
        }
      }).catch(() => {
        message.warning("记录发货失败！", 2);
      })
    }
  };
  handleSendCancel = () => {
    this.setState({sendNumVisible: false});
  };

  render() {
    const pagination = {
      total: this.state.storeData.length,
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
        title="存储列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  if(window.sessionStorage.getItem("sale_send") !== null) {
                    window.sessionStorage.removeItem("sale_send");
                  }
                  window.sessionStorage.removeItem("sale_store_look_order_id");
                  window.history.back();
                }
              }
            >
              返回
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.sendVisible}}
              onClick={
                () => {
                  this.sendStore()
                }
              }
            >
              出库
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.storeData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"store_id"}
        />
        <Modal
          visible={this.state.sendNumVisible}
          title={"订单"+this.state.lookSale+",存储项"+this.state.send_store_id}
          onOk={() => {this.handleSendSubmit()}}
          onCancel={() => {this.handleSendCancel()}}
        >
          <p>{"剩余存储"+this.state.send_store_remaining}</p>
          <Input id="numToSend" onChange={value => this.getSendNum(value.target.value)}/>
        </Modal>
      </Card>
    )
  }
}

module.export = ProductStoreDetail;
