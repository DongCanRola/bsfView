/**
 * Created by dongc_000 on 2018/5/1.
 */

const customerList = [
  {
    title: "编号",
    width: "7%",
    dataIndex: "customerId",
    sorter: (a, b) => a.customerId - b.customerId,
  },{
    title:"供应类型",
    render:(record) => {
      let show = "原材料";
      if(record.provideType === 2)
        show = "加工材料";
      return(<span>{show}</span>);
    },
    width:"10%"
  },{
    title: "名称",
    width: "16%",
    dataIndex: "customerName"
  },{
    title: "负责人",
    width: "10%",
    dataIndex: "customerManager"
  },{
    title: "电话",
    dataIndex: "customerTelephone",
    width: "10%"
  },{
    title: "邮箱",
    dataIndex: "customerEmail",
    width: "15%"
  },{
    title:"地址",
    dataIndex: "customerAddress",
    width:"25%"
  },{
    title: "类型",
    render:(record) => {
      let show = "供应商";
      //if(record.customerType === 3)
      //show = "代理销售";
      return(<span>{show}</span>);
    },
    width: "7%"
    //dataIndex: "customerType"
  }
];
export function customerColumn() {
  return customerList;
}

const orderList = [
  {
    title: "编号",
    dataIndex: "purchaseOrder_id",
    width: "15%"
  },{
    title: "货物名称",
    dataIndex: "purchaseGoods_name",
    width: "15%"
  },{
    title: "数量",
    dataIndex: "purchase_num",
    width: "15%"
  },{
    title: "单价",
    dataIndex: "purchase_price",
    width: "15%"
  },{
    title: "供应商",
    dataIndex: "provider_name",
    width: "20%"
  },{
    title: "订货时间",
    dataIndex: "purchase_time",
    width: "20%"
  }
];
export function orderColumn() {
  return orderList;
}
