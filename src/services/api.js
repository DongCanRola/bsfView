import { post, get, put } from '../utils/request';
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

export async function modifyUserPassword(userId, oldPassword, newPassword) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  headers.set("user_id", userId);
  headers.set("password_old", md5(oldPassword));
  headers.set("password_new", md5(newPassword));
  //console.log(userId);
  //console.log(oldPassword);
  //console.log(newPassword);
  return put("/api/user/modify/password", headers);
}

export async function getUsers() {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  return get("/api/user/list",headers);
}

export async function addUser(obj) {
  var headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');

  var body = {
    "user_name": obj.user_name,
    "phone": obj.phone,
    "qqnumber": obj.qqnumber,
    "wechat": obj.wechat,
    "email": obj.email,
    "password": md5("123"),
    "user_roles": obj.user_roles
  };
  console.log(body);
  return post("/api/user/add",headers,body);
}

export function updateUserMessage(obj) {
  let headers = new Headers();
  headers.append('Content-Type', "application/json");
  headers.append('Accept', 'application/json');
  let body = {
    "user_id": obj.user_id,
    "user_name": obj.user_name,
    "phone": obj.phone,
    "qqnumber": obj.qqnumber,
    "wechat": obj.wechat,
    "email": obj.email
  }
}

function getTest() {
  var headers = new Headers();
  headers.append("Content-Type","application/json");
  headers.append('Accept', 'application/json');
  return get("/api/employee/list",headers);
}




