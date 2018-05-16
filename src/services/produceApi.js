/**
 * Created by dongc_000 on 2018/5/15.
 */
import { post, get, put } from '../utils/request';

export async function addSample(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    sample_productId: obj.sample_productId,
    sample_description: obj.sample_description,
    sample_materialCost: obj.sample_materialCost,
    sample_processCost: obj.sample_processCost,
    sample_humanCost: obj.sample_humanCost,
    sample_userId: obj.sample_userId
  };
  return post("/api/process/sample/add", headers, body);
}

export async function getSampleOfProduct(productId) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("sample_productId", productId);
  return get("/api/process/sample/productList", headers);
}

export async function confirmNewSample(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    sale_orderId: obj.sale_orderId,
    sample_id: obj.sample_id,
    process_state: obj.process_state,
    process_userId: obj.process_userId
  };
  return post("/api/process/process/add", headers, body);
}

export async function recordSampleUse(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    use_sampleId: obj.use_sampleId,
    use_purchaseStoreId: obj.use_purchaseStoreId,
    use_num: obj.use_num,
    use_sampleUser: obj.use_sampleUser
  };
  return post("/api/process/sample/use", headers, body);
}

