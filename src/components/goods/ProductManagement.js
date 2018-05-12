/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Table, Form, Modal, Input, message, Button, Collapse} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';
import {getProduct, addProduct, confirmProduct} from '../../services/goodsApi';

const Panel = Collapse.Panel;
const customPanelStyle = {
  background: '#d6d6d6',
  borderRadius: 4,
  fontSize:"14px",
  fontColor:''
};

const FormItem = Form.Item;
const ProductForm = Form.create() (
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="新增成品种类"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="名称">
            {getFieldDecorator('newProductName',{
              rules: [{required: true, message: '请输入成品名称！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="等级">
            {getFieldDecorator('newProductLevel',{
              rules: [{required: true, message: '请输入成品等级！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="颜色">
            {getFieldDecorator('newProductColor',{
              rules: [{required: true, message: '请输入成品颜色！'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="风格">
            {getFieldDecorator('newProductStyle',{
              rules: [{required: true, message: '请输入成品风格！'}],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
);

export default class ProductManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      operationVisible: window.sessionStorage.getItem("currentRole") === "6" ? "inline":"none",
      requiredVisible: window.sessionStorage.getItem("currentRole") === "3" ? 'inline':'none',
      loadingProduct: true,
      addState: '',

      productData: [],
      selectedRowKeys: [],
      requiredData: [],
      selectedRequiredRowKeys: [],
      column: [
        {
          title: "编号",
          dataIndex: "productId",
          width: "20%"
        },{
          title: "名称",
          dataIndex: "productName",
          width: "20%"
        },{
          title: "等级",
          dataIndex: "productLevel",
          width: "20%"
        },{
          title: "颜色",
          dataIndex: "productColor",
          width: "20%"
        },{
          title: "风格",
          dataIndex: "productStyle",
          width: "20%"
        }
      ]
    };
    this.setData('1');
    this.setData('2');
  }

  setData(type) {
    getProduct(type).then(resp => {
      let v = [];
      console.log(resp.data.entity);
      for(let item of resp.data.entity) {
        v.push({
          productId: item.product_id,
          productName: item.product_name,
          productLevel: item.product_level,
          productColor: item.product_color,
          productStyle: item.product_style
        });
      }
      if(type === '1') {
        this.setState({
          productData: v,
          loadingProduct: false
        });
      }
      if(type === '2') {
        this.setState({
          requiredData: v,
          loadingRequired: false
        });
      }
    }).catch(() => {
      message.warning("获取数据失败！");
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  };
  handleProductCancel = () => {
    this.setState({addVisible: false});
  };
  handleProductCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      let obj = {
        product_name: values.newProductName,
        product_level: values.newProductLevel,
        product_color: values.newProductColor,
        product_style: values.newProductStyle,
        product_state: this.state.addState
      };
      addProduct(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("增加成功，新成品ID为："+resp.data.entity.message, 5);
          this.setData('1');
          this.setData('2');
          this.setState({addVisible: false});
        }
      }).catch(() => {
        message.warning("增加失败！");
      })
    })
  };

  confirmProduct() {
    let requiredProduct = this.state.selectedRequiredRowKeys;
    if(requiredProduct.length !== 1) {
      message.warning("请选择一条需要确定的成品！", 2);
    } else {
      let obj = {
        product_id: requiredProduct[0],
        product_state: '1'
      };
      confirmProduct(obj).then(resp => {
        console.log("confirm product result: ", resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("确认成功！", 2);
          this.setData('1');
          this.setData('2');
        }
      }).catch(() => {
        message.warning("确认失败，请重新操作！", 2);
      })
    }
  }

  productNext(type) {
    let chooseProduct = [];
    if(type === '1') {
      chooseProduct = this.state.selectedRowKeys;
    } else {
      chooseProduct = this.state.selectedRequiredRowKeys;
    }
    if(chooseProduct.length !== 1) {
      message.warning("请选择一种成品！", 2);
    } else {
      window.sessionStorage.setItem("order_product", chooseProduct[0]);
      browserHistory.push({pathname: '/saleCustomerManagement'});
    }
  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  onSelectRequiredChange(selectedRequiredRowKeys) {
    console.log("selectedRequiredRowKeys changed: ", selectedRequiredRowKeys);
    this.setState({selectedRequiredRowKeys});
  }

  render() {

    const paginationProduct = {
      total: this.state.productData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };
    const paginationRequired = {
      total: this.state.requiredData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    const {selectedRowKeys} = this.state;
    const {selectedRequiredRowKeys} = this.state;

    const productSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    };
    const requiredSelection = {
      selectedRequiredRowKeys,
      onChange: this.onSelectRequiredChange.bind(this)
    };

    return (
    <Collapse bordered={false} defaultActiveKey={["1","2"]} style={{marginTop: 30}}>
      <Panel panel-primary header="成品" key="1" style={customPanelStyle}>
        <Card
          title="成品种类列表"
          extra={
            <div>
              <Button
                style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.operationVisible}}
                onClick={
                  () => {
                    this.setState({
                      addVisible:true,
                      addState: '1'
                    });
                  }
                }
              >
                增加成品种类
              </Button>
              <Button
                style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.requiredVisible}}
                onClick={
                  () => {
                    this.productNext('1')
                  }
                }
              >
                下一步
              </Button>
              <Button
                style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.requiredVisible}}
                onClick={
                  () => {
                    window.history.back();
                  }
                }
              >
                返回
              </Button>
            </div>
          }
        >
          <Table
            rowSelection={productSelection}
            columns={this.state.column}
            dataSource={this.state.productData}
            bordered
            pagination={paginationProduct}
            scroll={{x: 1000, y: 1000}}
            loading={this.state.loadingProduct}
            rowKey={"productId"}
          />
          <ProductForm
            ref={this.saveFormRef}
            visible={this.state.addVisible}
            onCancel={this.handleProductCancel}
            onCreate={this.handleProductCreate}
          />
        </Card>
      </Panel>
      <Panel panel-primary header="需求" key="2" style={customPanelStyle}>
        <Card
          title="需求成品列表"
          extra={
            <div>
              <Button
                style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.requiredVisible}}
                onClick={
                  () => {
                    this.setState({
                      addVisible:true,
                      addState: '2'
                    });
                  }
                }
              >
                增加需求
              </Button>
              <Button
                style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.operationVisible}}
                onClick={
                  () => {
                    this.confirmProduct()
                  }
                }
              >
                确定成品
              </Button>
              <Button
                style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.requiredVisible}}
                onClick={
                  () => {
                    this.productNext('2')
                  }
                }
              >
                下一步
              </Button>
              <Button
                style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.requiredVisible}}
                onClick={
                  () => {
                    window.history.back();
                  }
                }
              >
                返回
              </Button>
            </div>
          }
        >
          <Table
            rowSelection={requiredSelection}
            columns={this.state.column}
            dataSource={this.state.requiredData}
            bordered
            pagination={paginationRequired}
            scroll={{x: 1000, y: 1000}}
            loading={this.state.loadingRequired}
            rowKey={"productId"}
          />
        </Card>
      </Panel>
    </Collapse>
    )
  }
}

module.export = ProductManagement;
