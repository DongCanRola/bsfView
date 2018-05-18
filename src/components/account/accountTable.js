/**
 * Created by dongc_000 on 2018/5/18.
 */

const saleGatherDetailList = [
  {
    title: "编号",
    dataIndex: "detail_id",
    width: "15%"
  },{
    title: "收款单",
    dataIndex: "detail_gather",
    width: "15%"
  },{
    title: "金额",
    dataIndex: "detail_money",
    width: "15%"
  },{
    title: "时间",
    dataIndex: "detail_time",
    width: "20%"
  },{
    title: "账户",
    dataIndex: "detail_savings",
    width: "15%"
  },{
    title: "收款人",
    dataIndex: "detail_user",
    width: "15%"
  }
];
export function saleGatherDetailColumn() {
  return saleGatherDetailList;
}

const purchasePayDetailList = [
  {
    title: "编号",
    dataIndex: "detail_id",
    width: "15%"
  },{
    title: "付款单",
    dataIndex: "pay_id",
    width: "15%"
  },{
    title: "付款金额",
    dataIndex: "pay_money",
    width: "15%"
  },{
    title: "付款时间",
    dataIndex: "pay_time",
    width: "20%"
  },{
    title: "付款账户",
    dataIndex: "pay_savings",
    width: "15%"
  },{
    title: "付款人",
    dataIndex: "pay_user",
    width: "15%"
  }
];
export function purchasePayDetailColumn() {
  return purchasePayDetailList;
}
