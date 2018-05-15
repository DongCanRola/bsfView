/**
 * Created by dongc_000 on 2018/5/15.
 */
import { post, get, put } from '../utils/request';

export async function addSample() {

}

export async function getSampleOfProduct(productId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("sample_productId", productId);
  return get("/api/process/sample/productList", headers);
}

