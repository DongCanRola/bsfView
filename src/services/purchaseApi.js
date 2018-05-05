/**
 * Created by dongc_000 on 2018/5/5.
 */
import { post, get, put } from '../utils/request';

export async function getOrdersByState(state) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("orderState", state);
  return get("/api/purchase/order/stateList", headers);
}

export async function addNewOrder(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    purchaseOrder_id: obj.purchaseOrder_id,
    purchaseGoods_id: obj.purchaseGoods_id,
    purchase_num: obj.purchase_num,
    purchase_price: obj.purchase_price,
    provider_id: obj.provider_id
  };
  return post("/api/purchase/order/add", headers, body);
}
