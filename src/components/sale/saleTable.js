/**
 * Created by dongc_000 on 2018/5/1.
 */

const customerList = [
  {
    title: "编号",
    width: "10%",
    dataIndex: "customerId",
    sorter: (a, b) => a.customerId - b.customerId,
  },{
    title: "类型",
    render:(record) => {
      let show = "直接销售";
      if(record.customerType === 3)
        show = "代理销售";
      return(<span>{show}</span>);
    },
    width: "10%"
    //dataIndex: "customerType"
  },{
    title: "名称",
    width: "20%",
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
  }
];
export function customerColumn() {
  return customerList;
}

const planOrderList = [
  {
    title: "订单编号",
    dataIndex: "sale_orderId",
    width: "18%"
  },{
    title: "成品编号",
    dataIndex: "sale_productId",
    width: "18%"
  },{
    title: "客户编号",
    dataIndex: "sale_consumerId",
    width: "18%"
  },{
    title: "计划时间",
    dataIndex: "sale_orderTime",
    width: "23%"
  },{
    title: "处理人",
    dataIndex: "sale_user",
    width: "18%"
  }
];
export function planOrderColumn() {
  return planOrderList;
}

const sampleOrderList = [
  {
    title: "订单编号",
    dataIndex: "sale_orderId",
    width: "15%"
  },{
    title: "成品编号",
    dataIndex: "sale_productId",
    width: "15%"
  },{
    title: "单位成本",
    dataIndex: "sale_cost",
    width: "15%"
  },{
    title: "客户编号",
    dataIndex: "sale_consumerId",
    width: "15%"
  },{
    title: "计划时间",
    dataIndex: "sale_orderTime",
    width: "20%"
  },{
    title: "处理人",
    dataIndex: "sale_user",
    width: "15%"
  }
];
export function sampleOrderColumn() {
  return sampleOrderList;
}

const completeOrderList = [
  {
    title: "订单编号",
    dataIndex: "sale_orderId",
    width: "12%"
  },{
    title: "成品编号",
    dataIndex: "sale_productId",
    width: "12%"
  },{
    title: "数量",
    dataIndex: "sale_num",
    width: "12%"
  },{
    title: "单位成本",
    dataIndex: "sale_cost",
    width: "12%"
  },{
    title: "单价",
    dataIndex: "sale_price",
    width: "12%"
  },{
    title: "客户编号",
    dataIndex: "sale_consumerId",
    width: "12%"
  },{
    title: "确定时间",
    dataIndex: "sale_orderTime",
    width: "15%"
  },{
    title: "处理人",
    dataIndex: "sale_user",
    width: "12%"
  }
];
export function completeOrderColumn() {
  return completeOrderList;
}
