/**
 * Created by dongc_000 on 2018/5/11.
 */
import { post, get, put } from '../utils/request';

export async function getOrdersByState(state) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("sale_state", state);
  return get("/api/sale/order/stateList", headers);
}

export async function addPlanOrder(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    sale_productId: obj.sale_productId,
    sale_consumerId: obj.sale_consumerId,
    sale_user: obj.sale_user
  };
  return post("/api/sale/order/add", headers, body);
}

export async function updateOrderState(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    sale_orderId: obj.sale_orderId,
    sale_state: obj.sale_state
  };
  return put("/api/sale/order/update", headers, body);
}

