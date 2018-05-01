/**
 * Created by dongc_000 on 2018/5/1.
 */
import { post, get, put } from '../utils/request';

export async function getCustomer(type) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("customerType",type);
  return get("/api/customer/saleList",headers);
}

export async function getCustomerByProvide(type) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("provideType",type);
  return get("/api/customer/provideList",headers);
}

export async function addCustomer(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    type: obj.type,
    provideType: obj.provideType,
    name: obj.name,
    manager: obj.manager,
    telephone: obj.telephone,
    email: obj.email,
    address: obj.address
  };
  return post("/api/customer/add", headers, body);
}
