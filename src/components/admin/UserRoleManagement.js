/**
 * Created by dongc_000 on 2018/5/22.
 */
import React from 'react';
import {Card, Table, Button, message} from 'antd';
import { Router, Route,IndexRoute,hashHistory,browserHistory } from 'dva/router';

import {modifyUserRoles} from '../../services/api';

export default class UserRoleManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      column: [
        {
          title: "编号",
          dataIndex: "role_id",
          width: "49%"
        },{
          title: "职责",
          dataIndex: "role_name",
          width: "50%"
        }
      ],
      roleData: [
        {
          role_id: 2,
          role_name: "管理员"
        },{
          role_id: 3,
          role_name: "销售"
        },{
          role_id: 4,
          role_name: "进货"
        },{
          role_id: 5,
          role_name: "仓库管理"
        },{
          role_id: 6,
          role_name: "生产"
        },{
          role_id: 7,
          role_name: "财务管理"
        }
      ],
      selectedRowKeys: []
    };
  }

  onSelectChange(selectedRowKeys) {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({selectedRowKeys});
  }

  confirmRoles() {
    let obj = {
      user_id: window.sessionStorage.getItem("user_modify_role_id"),
      user_roles: this.state.selectedRowKeys
    };
    modifyUserRoles(obj).then(resp => {
      console.log("update user roles result: ", resp.data.entity);
      if(resp.data.entity.result === 'ok') {
        message.success("成功更新用户职责！", 2);
        window.sessionStorage.removeItem("user_modify_role_id");
        browserHistory.push({pathname: '/userManagement'});
      } else {
        message.warning("更新用户职责失败！", 2);
      }
    }).catch(() => {
      message.warning("更新职责失败！", 2);
    })
  }

  render() {

    const {selectedRowKeys} = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    };

    return (
      <Card
        title="职责列表"
        extra={
          <div>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  this.confirmRoles();
                }
              }
            >
              确定
            </Button>
            <Button
              style={{width: 120, marginRight: 5, marginLeft: 10}}
              onClick={
                () => {
                  window.sessionStorage.removeItem("user_modify_role_id");
                  window.history.back();
                }
              }
            >
              取消
            </Button>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={this.state.column}
          dataSource={this.state.roleData}
          bordered
          scroll={{x: 1000, y: 1000}}
          rowKey={"role_id"}
        />
      </Card>
    )
  }
}
