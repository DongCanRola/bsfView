/**
 * Created by dongc_000 on 2018/5/8.
 */
import React from 'react';
import {Card, Table, Button, message, Modal, Input} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {getSaleGatherList, addSaleGatherDetail} from '../../services/accountApi';

export default class SaleGatherManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gatherData: [],
      column: [
        {
          title: "编号",
          dataIndex: "gather_id",
          width: "10%"
        },{
          title: "销售单",
          dataIndex: "gather_saleId",
          width: "10%"
        },{
          title: "计划总额",
          dataIndex: "gather_planTotal",
          width: "10%"
        },{
          title: "折扣",
          dataIndex: "gather_discount",
          width: "10%"
        },{
          title: "实际总额",
          dataIndex: "gather_actualTotal",
          width: "10%"
        },{
          title: "已收",
          dataIndex: "gather_already",
          width: "10%"
        },{
          title: "待收",
          dataIndex: "gather_surplus",
          width: "10%"
        },{
          title: "订单时间",
          dataIndex: "gather_saleTime",
          width: "25%"
        }
      ],
      loadingData: true,
      selectedRowKeys: [],
      selectedRows: [],
      gatherVisible: window.sessionStorage.getItem("gather_savings") !== null,
      gatherMoney: ''
    };
    this.setData();
  }

  setData() {
    getSaleGatherList().then(resp => {
      console.log("sale gather lists: ", resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          gather_id: item.gather_id,
          gather_saleId: item.gather_saleId,
          gather_planTotal: item.gather_planTotal,
          gather_discount: item.gather_discount,
          gather_actualTotal: item.gather_actualTotal,
          gather_already: item.gather_already,
          gather_surplus: item.gather_surplus,
          gather_saleTime: item.gather_saleTime
        });
      }
      this.setState({
        gatherData: v,
        loadingData: false
      });
    }).catch(() => {
      message.warning("数据获取失败！", 2);
    })
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    console.log("selectedRows changed: ", selectedRows);
    this.setState({selectedRowKeys, selectedRows});
  }

  saleGather() {
    let gathers = this.state.selectedRows;
    if(gathers.length !== 1) {
      message.warning("请选择一个收款单！", 2);
    } else {
      window.sessionStorage.setItem("gather_id", gathers[0].gather_id);
      window.sessionStorage.setItem("gather_wait", gathers[0].gather_surplus);
      browserHistory.push({pathname: '/savingsManagement'});
    }
  }

  getGatherNum(inValue) {
    console.log("gather money: ", inValue);
    this.setState({gatherMoney: inValue});
  }
  handleGatherSubmit = () =>{
    let gather_money = this.state.gatherMoney;
    let wait_gather = window.sessionStorage.getItem("gather_wait");
    if(gather_money > wait_gather) {
      message.warning("收款金额错误！", 2);
    } else {
      let obj = {
        detail_gather: window.sessionStorage.getItem("gather_id"),
        detail_money: gather_money,
        detail_user: window.sessionStorage.getItem("userId"),
        detail_savings: window.sessionStorage.getItem("gather_savings")
      };
      addSaleGatherDetail(obj).then(resp => {
        console.log("sale gather result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("收款成功！", 2);
          this.setState({gatherVisible: false});
          this.setData();
          window.sessionStorage.removeItem("gather_id");
          window.sessionStorage.removeItem("gather_savings");
          window.sessionStorage.removeItem("gather_wait");
        } else {
          message.warning("请检查收款金额！", 2);
        }
      }).catch(() => {
        message.warning("添加收款失败！", 2);
      })
    }
  };
  handleGatherCancel = () => {
    window.sessionStorage.removeItem("gather_id");
    window.sessionStorage.removeItem("gather_savings");
    window.sessionStorage.removeItem("gather_wait");
    this.setState({gatherVisible: false});
  };

  lookDetail() {
    let gathers = this.state.selectedRowKeys;
    if(gathers.length !== 1) {
      message.warning("请选择一个收款单！", 2);
    } else {
      window.sessionStorage.setItem("look_gatherId", gathers[0]);
      browserHistory.push({pathname: '/saleGatherDetail'});
    }
  }

  render() {

    const pagination = {
      total: this.state.gatherData.length,
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
        title="销售收款单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.saleGather();
                }
              }
            >
              收款
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.lookDetail();
                }
              }
            >
              查看详情
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.gatherData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"gather_id"}
        />
        <Modal
          visible={this.state.gatherVisible}
          title={"收款账户：" + window.sessionStorage.getItem("gather_savings")}
          onOk={() => {this.handleGatherSubmit()}}
          onCancel={() => {this.handleGatherCancel()}}
        >
          <Input id="gatherMoney" onChange={value => this.getGatherNum(value.target.value)}/>
        </Modal>
      </Card>
    )
  }
}

module.export = SaleGatherManagement;
