/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Table, Button, message, Modal} from 'antd';
import {planOrderColumn} from './saleTable';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {getOrdersByState, addPlanOrder, updateOrderState} from '../../services/saleApi';

export default class PlanOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      planData: [],
      loadingData: true,
      selectedRowKeys: [],
      column: planOrderColumn(),
      addVisible: window.sessionStorage.getItem("order_product") !== null && window.sessionStorage.getItem("order_consumer") !== null
    };
    this.setData();
  }

  setData() {
    getOrdersByState('1').then(resp => {
      console.log("plan sale orders: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          sale_orderId: item.sale_orderId,
          sale_productId: item.sale_productId,
          sale_consumerId: item.sale_consumerId,
          sale_orderTime: item.sale_orderTime,
          sale_user: item.sale_user
        });
      }
      this.setState({
        planData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("获取订单列表失败！", 2);
    })
  }

  onSelectChangePlan(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  handleCancel = () => {
    window.sessionStorage.removeItem("order_product");
    window.sessionStorage.removeItem("order_consumer");
    this.setState({addVisible: false});
  };
  handleOk = () => {
    let obj = {
      sale_productId: window.sessionStorage.getItem("order_product"),
      sale_consumerId: window.sessionStorage.getItem("order_consumer"),
      sale_user: window.sessionStorage.getItem("userId")
    };
    addPlanOrder(obj).then(resp => {
      console.log(resp.data.entity);
      if(resp.data.entity.result === 'ok') {
        message.success("增加订单计划成功，订单编号："+resp.data.entity.message, 2);
        this.setData();
        this.setState({addVisible: false});
        window.sessionStorage.removeItem("order_product");
        window.sessionStorage.removeItem("order_consumer");
      } else {
        message.warning("增加订单计划失败！", 2);
      }
    }).catch(() => {
      message.warning("增加订单计划失败！", 2);
    })
  };

  toSample() {
    let products = this.state.selectedRowKeys;
    if(products.length !== 1) {
      message.warning("请选择需要打样的订单计划！", 2);
    } else {
      let obj = {
        sale_orderId: products[0],
        sale_state: '2'
      };
      updateOrderState(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("转为打样成功！", 2);
          this.setData();
        }
      }).catch(() => {
        message.warning("转为打样失败！", 2);
      })
    }
  }

  orderCancel() {
    let products = this.state.selectedRowKeys;
    if(products.length !== 1) {
      message.warning("请选择一个订单取消！", 2);
    } else {
      let obj = {
        sale_orderId: products[0],
        sale_state: '11'
      };
      updateOrderState(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("成功取消！", 2);
          this.setData();
        }
      }).catch(() => {
        message.warning("取消失败！", 2);
      })
    }
  }

  render() {

    const pagination = {
      total: this.state.planData.length,
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
      onChange: this.onSelectChangePlan.bind(this)
    };

    return (
      <Card
        title="计划订单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  browserHistory.push({pathname: '/productChoose'})
                }
              }
            >
              添加订单
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.toSample()
                }
              }
            >
              打样
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.planData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"sale_orderId"}
        />

        <Modal
          title="增加计划信息"
          visible={this.state.addVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          >
          <p>{"计划成品："+window.sessionStorage.getItem("order_product")}</p>
          <p>{"计划客户："+window.sessionStorage.getItem("order_consumer")}</p>
        </Modal>
      </Card>
    )
  }
}

module.export = PlanOrderManagement;
