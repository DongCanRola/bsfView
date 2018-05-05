/**
 * Created by dongc_000 on 2018/5/5.
 */
import React from 'react';
import {Card, Button, message, Table} from 'antd';

import {orderColumn} from './buyTable';

export default class AllreOrderManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allreData: [],
      loadingData: true,
      selectedRowKeys: [],
      column: orderColumn()
    };
    this.setData();
  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  setData() {

  }

  render() {

    const pagination = {
      total: this.state.allreData.length,
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
    }

    return (
      <Card
        title="已确认订单列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  //this.setState({customerVisible:true});
                }
              }
            >
              取消订单
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.allreData}
          bordered
          pagination={pagination}
          scroll={{x: 1000, y: 1000}}
          loading={this.state.loadingData}
          rowKey={"purchaseOrder_id"}
        />
      </Card>
    )
  }
}

module.export = AllreOrderManagement;
