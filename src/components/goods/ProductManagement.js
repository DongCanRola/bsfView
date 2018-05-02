/**
 * Created by dongc_000 on 2018/5/1.
 */
import React from 'react';
import {Card, Table, Form, Modal, Input} from 'antd';

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
      operationVisible: window.sessionStorage.getItem("currentRole") === 6 ? "inline":"none",
      loadingProduct: true,

      productData: [],
      selectedRowKeys: [],
      column: [
        {
          title: "编号",
          dataIndex: "productId"
        },{
          title: "名称",
          dataIndex: "productName"
        },{
          title: "等级",
          dataIndex: "productLevel"
        },{
          title: "颜色",
          dataIndex: "productColor"
        },{
          title: "风格",
          dataIndex: "productStyle"
        }
      ]
    };
    this.setData();
  }

  setData() {

  }

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
      </Card>
    )
  }
}

module.export = ProductManagement;
