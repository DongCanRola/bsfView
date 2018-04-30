/**
 * Created by dongc_000 on 2018/4/30.
 */

const userList = [
  {
    title: "编号",
    width: "7%",
    dataIndex: "userId",
    sorter: (a, b) => a.userId - b.userId,
  },{
    title: "管理员",
    render:(record) => {
      let show = "否";
      for(let one of record.roles) {
        if(one === 2) {
          show = "是";
        }
      }
      return(<span>{show}</span>);
    },
    width: "6%"
  },{
    title: "销售",
    render:(record) => {
      let show = "否";
      for(let one of record.roles) {
        if(one === 3) {
          show = "是";
        }
      }
      return(<span>{show}</span>);
    },
    width: "5%"
  },{
    title: "进货",
    render:(record) => {
      let show = "否";
      for(let one of record.roles) {
        if(one === 4) {
          show = "是";
        }
      }
      return(<span>{show}</span>);
    },
    width: "5%"
  },{
    title: "库管",
    render:(record) => {
      let show = "否";
      for(let one of record.roles) {
        if(one === 5) {
          show = "是";
        }
      }
      return(<span>{show}</span>);
    },
    width: "5%"
  },{
    title: "生产加工",
    render:(record) => {
      let show = "否";
      for(let one of record.roles) {
        if(one === 6) {
          show = "是";
        }
      }
      return(<span>{show}</span>);
    },
    width: "9%"
  },{
    title: "财务",
    render:(record) => {
      let show = "否";
      for(let one of record.roles) {
        if(one === 7) {
          show = "是";
        }
      }
      return(<span>{show}</span>);
    },
    width: "5%"
  },{
    title: "姓名",
    dataIndex: "userName",
    width: "8%",
  }, {
    title: "电话",
    dataIndex: "phone",
    width: "10%"
  },{
    title: "QQ",
    dataIndex: "qq_number",
    width: "10%"
  },{
    title: "微信",
    dataIndex: "wechat",
    width: "10%"
  },{
    title: "邮箱",
    dataIndex: "email",
    width: "20%"
  }
];
export function userColumn() {
  return userList;
}

const employeeList = [
  {
    title: "员工编号",
    width: "20%",
    dataIndex: "employee_id",
    sorter: (a, b) => a.employee_id - b.employee_id,
  },{
    title: "员工姓名",
    dataIndex: "employee_name",
    width: "20%",
  },{
    title: "部门",
    dataIndex: "department",
    width: "20%",
  }, {
    title: "职位",
    dataIndex: "position",
    width: "20%"
  },{
    title: "状态",
    render:(record)=>{
      let show="";
      if(record.status==0){
        show = "异常";
      }else if(record.status==1){
        show = "正常";
      }else if(record.status==2){
        show = "已废除";
      }
      return(<span>{show}</span>);
    },
    width: "19%"
  }];

export  function employeeColumns(){
  return employeeList;
}


const equipment=[
  {
    title: "设备编号",
    width: "33%",
    dataIndex: "equipment_id",
    sorter: (a, b) => a.equipment_id - b.equipment_id,
  },
  {title: "设备名称",
    width: "33%",
    dataIndex: "equipment_name"
  }, {title: "设备状态",
    width: "33%",
    render:(record)=>{
      let show="";
      if(record.status==0){
        show = "异常";
      }else if(record.status==1){
        show = "正常";
      }else if(record.status==2){
        show = "已废除";
      }
      return(<span>{show}</span>);
    },
  }];

export function equipmentColumns(){
  return equipment;
}


const monitor=[
  {
    title: "监控器编号",
    width: "14%",
    dataIndex: "monitor_id",
    sorter: (a, b) => a.monitor_id - b.monitor_id,
  },
  {title: "绑定时间",
    width: "14%",
    dataIndex: "bind_timestamp"
  }, {
    title: "绑定状态",
    width: "15%",
    render:(record)=>{
      let show="";
      if(record.eq_m_status==0){
        show = "异常";
      }else if(record.eq_m_status==1){
        show = "正常";
      }else if(record.eq_m_status==2){
        show = "已废除";
      }
      return(<span>{show}</span>);
    }
  },
  {title: "监视器名称",
    width: "14%",
    dataIndex: "monitor_name"
  },
  {title: "频道名称",
    width: "14%",
    dataIndex: "channel_name"
  },
  {title: "备注",
    width: "14%",
    dataIndex: "remark"
  },{title: "监视器状态",
    width: "15%",
    render:(record)=>{
      let show="";
      if(record.m_status==0){
        show = "异常";
      }else if(record.m_status==1){
        show = "正常";
      }else if(record.m_status==2){
        show = "已废除";
      }
      return(<span>{show}</span>);
    },
  }];

export function monitorColumns(){
  return monitor;
}
