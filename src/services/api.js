import { post, get } from '../utils/request';
import md5 from 'js-md5';

export async function MonitorGetAll() {
  return get("/api/monitor/get_all")
}

export async function MonitorGetDetailValue(body) {
  return post("/api/monitor/get_monitordetailvalue",body)
}

export async function AuthSignIn(body) {
  return post("api/auth/login",body)
}

export async function login(userName,password,role) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("password", password);
  headers.set("userName", userName);
  headers.set("role",role);
  return post("/api/login",headers);
}

function addEmployee(){
  var headers = new Headers();
  headers.append("Content-Type","application/json");
  headers.append('Accept', 'application/json');
  var body={
    "department": "技术部",
    "employee_name": "post使用body添加",
    "position": "技术主管",
    "employee_id": 15,
    "password":"1234232356"
  }
  return post("/api/employee/add",headers,body);
}

function getTest() {
  var headers = new Headers();
  headers.append("Content-Type","application/json");
  headers.append('Accept', 'application/json');
  return get("/api/employee/list",headers);
}

function getProduceApplicationList(key){
  alert("test");
  let url='';
  var headers = new Headers();
  headers.append('Content-Type',"application/json");
  headers.append('Accept', 'application/json');
  headers.set('status',3);

  if(key==null||key==''){
    return get("/api/technicalchief/getproduceapplicationlist",headers);
  }else{
    headers.set("keyword",key);
    return get("/api/technicalchief/getproduceapplicationlist/search",headers);
  }

}


