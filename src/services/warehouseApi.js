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
