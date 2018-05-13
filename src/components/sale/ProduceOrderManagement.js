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

export default class ProduceOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      waitData: [],
      loadingWait: true,
      doingData: [],
      loadingDoing: true,
      doneData: [],
      loadingDone: true,

      waitColumn: completeOrderColumn(),
      doingColumn: completeOrderColumn(),
      doneColumn: completeOrderColumn()
    };
    this.setData('4');
    this.setData('5');
    this.setData('6');
  }

  setData(type) {
    getOrdersByState(type).then(resp => {
      console.log("processing orders: ", resp.data.entity);
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
      if(type === '4') {
        this.setState({
          waitData: v,
          loadingWait: false
        });
      }
      if(type === '5') {
        this.setState({
          doingData: v,
          loadingDoing: false
        });
      }
      if(type === '6') {
        this.setState({
          doneData: v,
          loadingDone: false
        });
      }
    }).catch(() => {
      message.warning("获取数据失败!", 2);
    })
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

    return (
      <Collapse bordered={false} defaultActiveKey={["1","2","3"]} style={{marginTop: 30}}>
        <Panel header="待加工" key="1" style={customPanelStyle}>
          <Card
            title="待加工订单列表"
          >
            <Table
              columns={this.state.waitColumn}
              dataSource={this.state.waitData}
              bordered
              pagination={paginationWait}
              scroll={{x: 1000, y: 1000}}
              loading={this.state.loadingWait}
              rowKey={"sale_orderId"}
            />
          </Card>
        </Panel>
        <Panel header="加工中" key="2" style={customPanelStyle}>
          <Card
            title="加工中订单列表"
          >
            <Table
              columns={this.state.doingColumn}
              dataSource={this.state.doingData}
              bordered
              pagination={paginationDoing}
              scroll={{x: 1000, y: 1000}}
              loading={this.state.loadingDoing}
              rowKey={"sale_orderId"}
            />
          </Card>
        </Panel>
        <Panel header="加工完成" key="3" style={customPanelStyle}>
          <Card
            title="加工完成订单列表"
          >
            <Table
              columns={this.state.doneColumn}
              dataSource={this.state.doneData}
              bordered
              pagination={paginationDone}
              scroll={{x: 1000, y: 1000}}
              loading={this.state.loadingDones}
              rowKey={"sale_orderId"}
            />
          </Card>
        </Panel>
      </Collapse>
    )

  }
}

module.export = ProduceOrderManagement;
