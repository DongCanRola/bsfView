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
    purchaseGoods_id: obj.purchaseGoods_id,
    purchase_num: obj.purchase_num,
    purchase_price: obj.purchase_price,
    provider_id: obj.provider_id
  };
  return post("/api/purchase/order/add", headers, body);
}

export async function changeOrderState(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  //headers.set("order_id", orderId);
  //headers.set("state", toState);
  var body = {
    purchaseOrder_id: obj.orderId,
    purchase_state: obj.toState
  };
  return put("/api/purchase/order/stateChange", headers, body);
}

export async function confirmOrder(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  //headers.set("order_id", orderId);
  //headers.set("state", toState);
  var body = {
    purchaseOrder_id: obj.orderId,
    purchase_state: obj.toState,
    purchase_discount: obj.orderDiscount,
    purchase_num: obj.orderNum,
    purchase_price: obj.orderPrice
  };
  return put("/api/purchase/order/stateChange", headers, body);
}
