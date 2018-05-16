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

const processList = [
  {
    title: "处理编号",
    dataIndex: "process_id",
    width: "20%"
  },{
    title: "销售订单",
    dataIndex: "sale_orderId",
    width: "20%"
  },{
    title: "样本",
    dataIndex: "sample_id",
    width: "20%"
  },{
    title: "生产数量",
    dataIndex: "process_productNum",
    width: "20%"
  },{
    title: "加工处理人",
    dataIndex: "process_userId",
    width: "20%"
  }
];
export function processColumn() {
  return processList;
}

const processMaterialList = [
  {
    title: "编号",
    dataIndex: "list_id",
    width: "13%"
  },{
    title: "加工编号",
    dataIndex: "list_process",
    width: "13%"
  },{
    title: "原料",
    dataIndex: "list_goods",
    width: "13%"
  },{
    title: "需要总量",
    dataIndex: "list_total",
    width: "13%"
  },{
    title: "仍需数量",
    dataIndex: "list_remaining",
    width: "13%"
  },{
    title: "状态",
    render:(record) => {
      let show = "拟定中";
      if(record.list_state === 1)
        show = "未调度";
      if(record.list_state === 2)
        show = "已出库";
      return(<span>{show}</span>);
    },
    width: "13%"
  },{
    title: "拟定时间",
    dataIndex: "list_time",
    width: "18%"
  }
];
export function processMaterialColumn() {
  return processMaterialList;
}
