/**
 * Created by dongc_000 on 2018/5/3.
 */
import React from 'react';
import {Card, Table, Form, Button, Input, message, Modal} from 'antd';

import {getAllWarehouse, addWarehouse} from '../../services/warehouseApi';

const FormItem = Form.Item;
const WarehouseForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="新增仓库"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <FormItem label="名称">
          {getFieldDecorator('newWarehouseName',{
            rules: [{ required: true, message: '请输入新仓库名称！'}],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem label="位置">
          {getFieldDecorator('newWarehouseLocation',{
            rules: [{ required: true, message: '请输入新仓库位置！'}],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem label="容量">
          {getFieldDecorator('newWarehouseSpare',{
            rules: [{ required: true, message: '请输入新仓库容量！'}],
          })(
            <Input/>
          )}
        </FormItem>
      </Modal>
    )
  }
);

export default class WarehouseManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      warehouseData: [],
      selectedRowKeys: [],
      loadingWarehouse: true,
      column: [
        {
          title: "编号",
          dataIndex: "warehouse_id",
          width: "10%"
        },{
          title: "名称",
          dataIndex: "warehouse_name",
          width: "25%"
        },{
          title: "位置",
          dataIndex: "warehouse_location",
          width: "35%"
        },{
          title: "剩余容量",
          dataIndex: "warehouse_spare",
          width: "25%"
        }
      ]
    };
    this.setData();
  }

  setData() {
    getAllWarehouse().then(resp => {
      console.log("warehouse list: ",resp.data.entity);
      let v =[];
      for(let item of resp.data.entity) {
        v.push({
          warehouse_id: item.warehouse_id,
          warehouse_name: item.warehouse_name,
          warehouse_location: item.warehouse_location,
          warehouse_spare: item.warehouse_spare
        });
      }
      this.setState({
        warehouseData: v,
        loadingWarehouse: false
      });
    }).catch(() => {
      message.warning("获取仓库列表失败！");
    })
  }

  onSelectChangeWarehouse(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  saveFormRef = (form) => {
    this.form = form;
  };
  handleAddCancel = () => {
    this.setState({addVisible: false});
  };
  handleAddCreate = () => {
    const form = this.form;
    form.validateFields((err, values) => {
      if(err) {
        return;
      }
      let obj = {
        warehouse_name: values.newWarehouseName,
        warehouse_location: values.newWarehouseLocation,
        warehouse_spare: values.newWarehouseSpare
      };
      addWarehouse(obj).then(resp => {
        console.log("add warehouse result: ",resp.data.entity);
        if(resp.data.entity.result === 'ok') {
          message.success("新增仓库成功，ID为："+resp.data.entity.message, 5);
          this.setData();
          this.setState({addVisible: false});
        } else {
          message.warning("新增仓库失败！");
        }
      }).catch(() => {
        message.warning("新增仓库失败！");
      })
    })
  };

  render() {

    const paginationWarehouse = {
      total: this.state.warehouseData.length,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize)
      },
      onChange(current) {
        console.log('Current: ', current)
      }
    };

    const {selectedRowKeys} = this.state;

    const warehouseSelection = {
      selectedRowKeys,
      onChange: this.onSelectChangeWarehouse.bind(this)
    };

    return (
      <Card
        title="仓库列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.setState({addVisible:true});
                }
              }
            >
              新增仓库
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={warehouseSelection}
          columns={this.state.column}
          dataSource={this.state.warehouseData}
          bordered
          pagination={paginationWarehouse}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingWarehouse}
          rowKey={"warehouse_id"}
        />
        <WarehouseForm
          ref={this.saveFormRef}
          visible={this.state.addVisible}
          onCancel={this.handleAddCancel}
          onCreate={this.handleAddCreate}
        />
      </Card>
    )
  }
}

module.export = WarehouseManagement;