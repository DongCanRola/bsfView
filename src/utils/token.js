/**
 * Created by zuce wei on 2017/3/30.
 */
import {getToken} from '../components/sign/auth'

export function getAccessToken(){
  let tokenStr=window.sessionStorage.getItem("access_token");
  if(tokenStr==null){
    let employeeId=window.localStorage.getItem("employeeId");
    let password=window.localStorage.getItem("password");
    console.log("获取到的employeeId："+employeeId+"  password:"+password);
    getToken({
      employeeid:employeeId,
      password:password
    });
  }
  console.log("token"+window.sessionStorage.getItem("access_token"));
  return window.sessionStorage.getItem("access_token");
}
