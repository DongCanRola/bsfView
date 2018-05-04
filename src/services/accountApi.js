/**
 * Created by dongc_000 on 2018/5/4.
 */
import { post, get, put } from '../utils/request';

export async function getAllSavings() {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  return get("/api/savings/list", headers);
}

export async function addSavings(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    savings_id: obj.savings_id,
    savings_bank: obj.savings_bank,
    savings_balance: obj.savings_balance
  };
  return post("/api/savings/add", headers, body);
}
