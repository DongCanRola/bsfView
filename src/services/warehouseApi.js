/**
 * Created by dongc_000 on 2018/5/3.
 */
import { post, get, put } from '../utils/request';

export async function getAllWarehouse() {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  return get("/api/warehouse/list", headers);
}

export async function addWarehouse(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    warehouse_name: obj.warehouse_name,
    warehouse_location: obj.warehouse_location,
    warehouse_spare: obj.warehouse_spare
  };
  return post("/api/warehouse/add", headers, body);
}

export async function lookWarehouseDetail(warehouseId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("stock_warehouseId", warehouseId);
  return get("/api/warehouse/stock/warehouse", headers);
}

export async function lookGoodsStockTotal() {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  return get("/api/warehouse/goods/num", headers);
}

export async function lookGoodsStockDetail(goodsId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("stock_goodsid", goodsId);
  return get("/api/warehouse/stock/goods", headers);
}

export async function getPurchaseStoreListByPurchase(purchaseId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("purchase_orderId", purchaseId);
  return get("/api/warehouse/purchase/store/purchaseList", headers);
}

export async function getPurchaseStoreListByGoods(goodsId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("goods_id", goodsId);
  return get("/api/warehouse/purchase/storeByGoods", headers);
}

export async function storePurchase(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    purchase_orderId: obj.purchase_orderId,
    purchase_storeWarehouse: obj.purchase_storeWarehouse,
    purchase_storeNum: obj.purchase_storeNum,
    purchase_storeRemaining: obj.purchase_storeRemaining,
    purchase_storeUser: obj.purchase_storeUser
  };
  return post("/api/warehouse/purchase/store", headers, body);
}

export async function fetchProcessMaterial(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    use_listId: obj.use_listId,
    use_storeId: obj.use_storeId,
    use_num: obj.use_num,
    use_user: obj.use_user
  };
  return post("/api/warehouse/process/materialUse/add", headers, body);
}

export async function getMaterialUseListByProcessOrder(listId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("processOrderId", listId);
  return get("/api/warehouse/process/materialUse/processOrderList", headers);
}

export async function storeProduct(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    store_saleId: obj.store_saleId,
    store_warehouseId: obj.store_warehouseId,
    store_num: obj.store_num,
    store_remaining: obj.store_remaining,
    store_user: obj.store_user
  };
  return post("/api/warehouse/product/store", headers, body);
}

export async function sendProduct(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    send_storeId: obj.send_storeId,
    send_num: obj.send_num,
    send_user: obj.send_user
  };
  return post("/api/warehouse/product/send", headers, body);
}

export async function getProductStoreBySale(saleId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("sale_id", saleId);
  return get("/api/warehouse/product/storeListSale", headers);
}

export async function getProductSendBySale(saleId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("sale_id", saleId);
  return get("/api/warehouse/product/sendListSale", headers);
}
