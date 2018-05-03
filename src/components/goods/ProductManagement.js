/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Table, Form, Modal, Input, message, Button} from 'antd';

import {getProduct, addProduct} from '../../services/goodsApi';

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
      loadingProduct: true,

      productData: [],
      selectedRowKeys: [],
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
    this.setData();
  }

  setData() {
    getProduct().then(resp => {
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
      this.setState({
        productData: v,
        loadingProduct: false
      });
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
      var obj = {
        product_name: values.newProductName,
        product_level: values.newProductLevel,
        product_color: values.newProductColor,
        product_style: values.newProductStyle
      };
      addProduct(obj).then(resp => {
        console.log(resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("增加成功，新成品ID为："+resp.data.entity.message, 5);
          this.setData();
          this.setState({addVisible: false});
        }
      }).catch(() => {
        message.warning("增加失败！");
      })
    })
  };

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
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

    const {selectedRowKeys} = this.state;

    const productSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    };

    return (
      <Card
        title="成品种类列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10, display:this.state.operationVisible}}
              onClick={
                () => {
                  this.setState({addVisible:true});
                }
              }
            >
              增加成品种类
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
    )
  }
}

module.export = ProductManagement;
