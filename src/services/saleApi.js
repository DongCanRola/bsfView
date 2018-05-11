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
