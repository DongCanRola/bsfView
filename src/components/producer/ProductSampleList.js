/**
 * Created by dongc_000 on 2018/5/15.
 */
import React from 'react';
import {Card, Table, Button, message, Modal, Form} from 'antd';

import {getSampleOfProduct} from '../../services/produceApi';
import {sampleColumn} from './produceTable';

export default class ProductSampleList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      column: sampleColumn(),
      sampleData: [],
      loadingData: true,
      selectedRowKeys: [],
      productId: window.sessionStorage.getItem("product_id"),
      saleOrderId: window.sessionStorage.getItem("sale_sample_order_id"),
      saleVisible: window.sessionStorage.getItem("sale_sample_order_id") !== null ? 'inline':'none'
    };
    this.setData();
  }

  setData() {
    getSampleOfProduct(this.state.productId).then(resp => {
      console.log("samples of product: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          sample_id: item.sample_id,
          sample_productId: item.sample_productId,
          sample_description: item.sample_description,
          sample_materialCost: item.sample_materialCost,
          sample_processCost: item.sample_processCost,
          sample_humanCost: item.sample_humanCost,
          sample_userId: item.sample_userId
        });
      }
      this.setState({
        sampleData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取样本数据失败！", 2);
    })
  }

  addSample() {

  }

  confirmSample() {

  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  render() {

    const pagination = {
      total: this.state.sampleData.length,
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
        title="样本列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.addSample()
                }
              }
            >
              增加
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {

                }
              }
            >
              增加消耗
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {

                }
              }
            >
              更新
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.saleVisible}}
              onClick={
                () => {
                  this.confirmSample()
                }
              }
            >
              确定
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.sampleData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"sample_id"}
        />
      </Card>
    )
  }
}

module.export = ProductSampleList;
