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

export async function getPurchasePayList() {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  return get("/api/purchase/pay/list", headers);
}

export async function getPurchasePayDetailList(payId) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("purchasePay_id", payId);
  return get("/api/purchase/pay/detail/payList", headers);
}

export async function addPurchasePayDetail(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    pay_id: obj.pay_id,
    pay_money: obj.pay_money,
    pay_user: obj.pay_user,
    pay_savings: obj.pay_savings
  };
  return post("/api/purchase/pay/detail/add", headers, body);
}

export async function getSaleGatherList() {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  return get("/api/sale/gather/list", headers);
}

export async function getSaleGatherDetailList(gatherId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("sale_gatherId", gatherId);
  return get("/api/sale/gather/detail/gatherList", headers);
}

export async function addSaleGatherDetail(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    detail_gather: obj.detail_gather,
    detail_money: obj.detail_money,
    detail_user: obj.detail_user,
    detail_savings: obj.detail_savings
  };
  return post("/api/sale/gather/detail/add", headers, body);
}
