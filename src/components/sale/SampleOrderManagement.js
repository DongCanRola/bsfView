/**
 * Created by dongc_000 on 2018/5/11.
 */
import React from 'react';
import {Card, Table, Button, message, Modal, Form, Input, Collapse} from 'antd';
import {getOrdersByState, updateOrderState, confirmOrder} from '../../services/saleApi';
import {planOrderColumn, sampleOrderColumn} from './saleTable';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

const FormItem = Form.Item;
const ConfirmForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return(
      <Modal
        visible={visible}
        title="确定订单"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="数量">
            {getFieldDecorator('newOrderNum',{
              rules: [{ required:true, message: '请输入订单货物数量！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="单价">
            {getFieldDecorator('newOrderPrice',{
              rules: [{ required:true, message: '请输入订单货物单价！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="折扣">
            {getFieldDecorator('newOrderDiscount',{
              rules: [{ required:true, message: '请输入折扣！'}],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

export default class SampleOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      doingData: [],
      loadingDoing: true,
      doneData: [],
      loadingDone: true,
      doingColumn: planOrderColumn(),
      doneColumn: sampleOrderColumn(),
      selectedDoingRowKeys: [],
      selectedDoneRowKeys: [],

      confirmVisible: false,
      orderToConfirm: ''
    };
    this.setData('2');
    this.setData('3');
  }

  setData(type) {
    getOrdersByState(type).then(resp => {
      console.log("sample orders: ",resp.data.entity);
      let v = [];
      for(let item of resp.data.entity) {
        v.push({
          sale_orderId: item.sale_orderId,
          sale_productId: item.sale_productId,
          sale_cost: item.sale_cost,
          sale_consumerId: item.sale_consumerId,
          sale_orderTime: item.sale_orderTime,
          sale_user: item.sale_user
        });
      }
      if(type === '2') {
        this.setState({
          doingData: v,
          loadingDoing: false
        });
      }
      if(type === '3') {
        this.setState({
          doneData: v,
          loadingDone: false
        });
      }
    }).catch(() => {
      message.warning("获取数据失败！", 2);
    })
  }

  onSelectChangeDoing(selectedDoingRowKeys) {
    console.log("selectedDoingRowKeys changed: ", selectedDoingRowKeys);
    this.setState({selectedDoingRowKeys});
  }
  onSelectChangeDone(selectedDoneRowKeys) {
    console.log("selectedDoneRowKeys changed: ", selectedDoneRowKeys);
    this.setState({selectedDoneRowKeys});
  }

  orderCancel(type) {
    let orders = [];
    if(type === '2') {
      orders = this.state.selectedDoingRowKeys;
    } else {
      orders = this.state.selectedDoneRowKeys;
    }
    if(orders.length !== 1) {
      message.warning("请选择一项进行取消！", 2);
    } else {
      let obj = {
        sale_orderId: orders[0],
        sale_state: '11'
      };
      updateOrderState(obj).then(resp => {
        console.log(resp.data.entity);
        message.success("成功取消订单！", 2);
        this.setData(type);
      }).catch(() => {
        message.warning("取消失败！", 2);
      })
    }
  }

  confirmOrder() {
    let orders = this.state.selectedDoneRowKeys;
    if(orders.length !== 1) {
      message.warning("请选择一个订单进行确认！", 2);
    } else {
      this.setState({
        confirmVisible: true,
        orderToConfirm: orders[0]
      });
    }
  }

  saveFormRef = (form) => {
    this.form = form;
  };
  handleConfirmCancel= () => {
    this.setState({confirmVisible: false});
  };
  handleConfirmCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      let obj = {
        sale_orderId: this.state.orderToConfirm,
        sale_num: values.newOrderNum,
        sale_price: values.newOrderPrice,
        sale_discount: values.newOrderDiscount,
        sale_state: '4'
      };
      confirmOrder(obj).then(resp => {
        console.log("confirm order result: ", resp.data.entity);
        message.success("确认成功！", 2);
        this.setState({confirmVisible: false});
        this.setData('3');
      }).catch(() => {
        message.warning("确认失败！", 2);
      })
    })
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
      onChange: this.onSelectChangeDoing.bind(this)
    };
    const doneSelection = {
      selectedDoneRowKeys,
      onChange: this.onSelectChangeDone.bind(this)
    };

    return (
      <Collapse bordered={false} defaultActiveKey={["1","2"]} style={{marginTop: 30}}>
        <Panel panel-primary header="待打样" key="1" style={customPanelStyle}>
          <Card
            title="打样中订单列表"
            extra={
              <div>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      this.orderCancel('2')
                    }
                  }
                >
                  取消
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
              rowKey={"sale_orderId"}
            />
          </Card>
        </Panel>
        <Panel panel-primary header="打样完成" key="2" style={customPanelStyle}>
          <Card
            title="打样完成订单列表"
            extra={
              <div>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      this.confirmOrder()
                    }
                  }
                >
                  订单确认
                </Button>
                <Button
                  style={{width: 120, marginRight: 5, marginLeft: 10}}
                  onClick={
                    () => {
                      this.orderCancel('3')
                    }
                  }
                >
                  取消
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
              rowKey={"sale_orderId"}
            />
            <ConfirmForm
              ref={this.saveFormRef}
              visible={this.state.confirmVisible}
              onCancel={this.handleConfirmCancel}
              onCreate={this.handleConfirmCreate}
            />
          </Card>
        </Panel>
      </Collapse>
    )
  }
}

module.export = SampleOrderManagement;
