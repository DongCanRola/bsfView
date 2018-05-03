/**
 * Created by dongc_000 on 2018/5/3.
 */
import { post, get, put } from '../utils/request';

export async function getAllWarehouse() {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  return get("/api/warehouse/list", headers);
}

export async function addWarehouse(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  var body = {
    warehouse_name: obj.warehouse_name,
    warehouse_location: obj.warehouse_location,
    warehouse_spare: obj.warehouse_spare
  };
  return post("/api/warehouse/add", headers, body);
}
