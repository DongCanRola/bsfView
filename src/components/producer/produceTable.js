/**
 * Created by dongc_000 on 2018/5/15.
 */

const waitSampleList = [
  {
    title: "订单编号",
    dataIndex: "sale_orderId",
    width: "19%"
  },{
    title: "成品编号",
    dataIndex: "sale_productId",
    width: "19%"
  },{
    title: "计划时间",
    dataIndex: "sale_orderTime",
    width: "24%"
  },{
    title: "销售",
    dataIndex: "sale_user",
    width: "19%"
  }
];
export function waitSampleColumn() {
  return waitSampleList;
}

const sampleList = [
  {
    title: "样本编号",
    dataIndex: "sample_id",
    width: "10%"
  },{
    title: "成品编号",
    dataIndex: "sample_productId",
    width: "10%"
  },{
    title: "样本描述",
    dataIndex: "sample_description",
    width: "39%"
  },{
    title: "材料成本",
    dataIndex: "sample_materialCost",
    width: "10%"
  },{
    title: "过程成本",
    dataIndex: "sample_processCost",
    width: "10%"
  },{
    title: "人力成本",
    dataIndex: "sample_humanCost",
    width: "10%"
  },{
    title: "打样用户",
    dataIndex: "sample_userId",
    width: "10%"
  }
];
export function sampleColumn() {
  return sampleList;
}


