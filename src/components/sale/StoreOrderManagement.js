/**
 * Created by dongc_000 on 2018/5/11.
 */
import React from 'react';
import {Card, Table, message, Collapse} from 'antd';
import {getOrdersByState} from '../../services/saleApi';
import {completeOrderColumn} from './saleTable';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

export default class StoreOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inData: [],
      loadingIn: true,
      outData: [],
      loadingOut: true,

      inColumn: completeOrderColumn(),
      outColumn: completeOrderColumn()
    };
    this.setData('7');
    this.setData('8');
  }

  setData(type) {
    getOrdersByState(type).then(resp => {
      console.log("store orders: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          sale_orderId: item.sale_orderId,
          sale_productId: item.sale_productId,
          sale_num: item.sale_num,
          sale_cost: item.sale_cost,
          sale_price: item.sale_price,
          sale_consumerId: item.sale_consumerId,
          sale_orderTime: item.sale_orderTime,
          sale_user: item.sale_user
        });
      }
      if(type === '7') {
        this.setState({
          inData: v,
          loadingIn: false
        });
      }
      if(type === '8') {
        this.setState({
          outData: v,
          loadingOut: false
        });
      }
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
  }

  render() {

    const paginationIn = {
      total: this.state.inData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };
    const paginationOut = {
      total: this.state.outData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    return (
      <Collapse bordered={false} defaultActiveKey={["1","2"]} style={{marginTop: 30}}>
        <Panel header="入库订单" key="1" style={customPanelStyle}>
          <Card
            title="入库订单列表"
          >
            <Table
              columns={this.state.inColumn}
              dataSource={this.state.inData}
              bordered
              pagination={paginationIn}
              scroll={{x: 1000, y: 1000}}
              loading={this.state.loadingIn}
              rowKey={"sale_orderId"}
            />
          </Card>
        </Panel>
        <Panel header="出库订单" key="2" style={customPanelStyle}>
          <Card
            title="出库订单列表"
          >
            <Table
              columns={this.state.outColumn}
              dataSource={this.state.outData}
              bordered
              pagination={paginationOut}
              scroll={{x: 1000, y: 1000}}
              loading={this.state.loadingOut}
              rowKey={"sale_orderId"}
            />
          </Card>
        </Panel>
      </Collapse>
    )
  }
}

module.export = StoreOrderManagement;
