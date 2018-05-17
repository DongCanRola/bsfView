/**
 * Created by dongc_000 on 2018/5/15.
 */

const stockList = [
  {
    title: "仓库编号",
    dataIndex: "stock_warehouseId",
    width: "33%"
  },{
    title: "材料编号",
    dataIndex: "stock_goodsId",
    width: "33%"
  },{
    title: "库存数量",
    dataIndex: "stock_num",
    width: "33%"
  }
];
export function stockColumn() {
  return stockList;
}

const goodsStockList = [
  {
    title: "货物编号",
    dataIndex: "goods_id",
    width: "33%"
  },{
    title: "货物名称",
    dataIndex: "goods_name",
    width: "33%"
  },{
    title: "现有库存",
    dataIndex: "goods_remaining",
    width: "33%"
  }
];
export function goodsStockColumn() {
  return goodsStockList;
}

const purchaseStoringList = [
  {
    title: "进货单编号",
    dataIndex: "purchaseOrder_id",
    width: "15%"
  },{
    title: "货物编号",
    dataIndex: "purchaseGoods_id",
    width: "15%"
  },{
    title: "货物名称",
    dataIndex: "purchaseGoods_name",
    width: "15%"
  },{
    title: "进货数量",
    dataIndex: "purchase_num",
    width: "15%"
  },{
    title: "订单时间",
    dataIndex: "purchase_time",
    width: "20%"
  },{
    title: "未入库",
    dataIndex: "wait_store",
    width: "15%"
  }
];
export function purchaseStoringColumn() {
  return purchaseStoringList;
}

const purchaseStoredList = [
  {
    title: "进货单编号",
    dataIndex: "purchaseOrder_id",
    width: "18%"
  },{
    title: "货物编号",
    dataIndex: "purchaseGoods_id",
    width: "18%"
  },{
    title: "货物名称",
    dataIndex: "purchaseGoods_name",
    width: "18%"
  },{
    title: "进货数量",
    dataIndex: "purchase_num",
    width: "18%"
  },{
    title: "订单时间",
    dataIndex: "purchase_time",
    width: "23%"
  }
];
export function purchaseStoredColumn() {
  return purchaseStoredList;
}

const purchaseStoreList = [
  {
    title: "存储编号",
    dataIndex: "purchase_storeId",
    width: "12%"
  },{
    title: "进货单",
    dataIndex: "purchase_orderId",
    width: "12%"
  },{
    title: "仓库",
    dataIndex: "purchase_storeWarehouse",
    width: "12%"
  },{
    title: "存入数量",
    dataIndex: "purchase_storeNum",
    width: "12%"
  },{
    title: "单价",
    dataIndex: "purchase_storePrice",
    width: "12%"
  },{
    title: "存入剩余",
    dataIndex: "purchase_storeRemaining",
    width: "12%"
  },{
    title: "存入时间",
    dataIndex: "purchase_storeTime",
    width: "16%"
  },{
    title: "存入用户",
    dataIndex: "purchase_storeUser",
    width: "12%"
  }
];
export function purchaseStoreColumn() {
  return purchaseStoreList;
}

const processMaterialFetchList = [
  {
    title: "编号",
    dataIndex: "use_Id",
    width: "15%"
  },{
    title: "加工材料单",
    dataIndex: "use_listId",
    width: "15%"
  },{
    title: "进货存储分配",
    dataIndex: "use_storeId",
    width: "15%"
  },{
    title: "调用数量",
    dataIndex: "use_num",
    width: "15%"
  },{
    title: "调用时间",
    dataIndex: "use_time",
    width: "20%"
  },{
    title: "调用人",
    dataIndex: "use_user",
    width: "15%"
  }
];
export function processMaterialFetchColumn() {
  return processMaterialFetchList;
}

const saleOrderList = [
  {
    title: "编号",
    dataIndex: "sale_orderId",
    width: "15%"
  },{
    title: "成品",
    dataIndex: "sale_productId",
    width: "15%"
  },{
    title: "销售总量",
    dataIndex: "sale_num",
    width: "15%"
  },{
    title: "未入库数量",
    dataIndex: "store_remaining",
    width: "15%"
  },{
    title: "订单时间",
    dataIndex: "sale_orderTime",
    width: "20%"
  },{
    title: "销售员",
    dataIndex: "sale_user",
    width: "15%"
  }
];
export function saleOrderColumn() {
  return saleOrderList;
}

const productStoreList = [
  {
    title: "编号",
    dataIndex: "store_id",
    width: "13%"
  },{
    title: "销售单",
    dataIndex: "store_saleId",
    width: "13%"
  },{
    title: "仓库",
    dataIndex: "store_warehouseId",
    width: "13%"
  },{
    title: "存入数量",
    dataIndex: "store_num",
    width: "13%"
  },{
    title: "存储剩余",
    dataIndex: "store_remaining",
    width: "13%"
  },{
    title: "存入时间",
    dataIndex: "store_time",
    width: "18%"
  },{
    title: "存入用户",
    dataIndex: "store_user",
    width: "13%"
  }
];
export function productStoreColumn() {
  return productStoreList;
}

const productSendList = [
  {
    title: "",
    dataIndex: "send_id",
    width: "18%"
  },{
    title: "",
    dataIndex: "send_storeId",
    width: "18%"
  },{
    title: "",
    dataIndex: "send_num",
    width: "18%"
  },{
    title: "",
    dataIndex: "send_time",
    width: "25%"
  },{
    title: "",
    dataIndex: "send_user",
    width: "18%"
  }
];

export function productSendColumn() {
  return productSendList;
}
