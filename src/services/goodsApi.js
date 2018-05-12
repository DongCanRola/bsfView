/**
 * Created by dongc_000 on 2018/5/2.
 */
import { post, get, put } from '../utils/request';

export async function getMaterial(type) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("materialType", type);
  return get("/api/goods/material/list",headers);
}

export async function addMaterial(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    goods_type: obj.goods_type,
    goods_name: obj.goods_name
  };
  return post("/api/goods/material/add", headers, body);
}

export async function getProduct(type) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("productState", type);
  return get("/api/goods/product/list", headers);
}

export async function addProduct(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    product_name: obj.product_name,
    product_level: obj.product_level,
    product_color: obj.product_color,
    product_style: obj.product_style,
    product_state: obj.product_state
  };
  return post("/api/goods/product/add", headers, body);
}

export async function confirmProduct(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    product_id: obj.product_id,
    product_state: obj.product_state
  };
  return put("/api/goods/product/update", headers, body);
}
