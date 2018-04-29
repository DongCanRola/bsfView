
import {login, accessToken, accessToken1} from '../../services/api'
import { message} from 'antd';


const Auth = {

    signin (creds, callback) {
      login(creds.employeeid,creds.password).then(resp => {
        if (resp.data.result == 'ok') {
          if (creds.agreement) {
            window.localStorage.setItem('user', creds);
            window.localStorage.setItem("employeeId",creds.employeeid);
          }
          window.sessionStorage.setItem("password",creds.password);
          window.sessionStorage.setItem("employeeId",creds.employeeid);
          window.sessionStorage.setItem("userName",resp.data.data.employee_name);
          window.sessionStorage.setItem("user-token","token");
        }
        callback(resp) }).catch(e=>{message.warning("请求超时！",3);})
    },

    getToken(creds){
      let params="username="+creds.employeeid;
      params=params+"&grant_type=password";
      params=params+"&client_id=erp-client";
      params=params+"&client_secret=erp-secret";
      params=params+"&scope=read";
      params=params+"&password="+creds.password;
      accessToken(params).then(e=>{
        window.sessionStorage.setItem("access_token",e.data.access_token);
        window.sessionStorage.setItem("refresh_token",e.data.refresh_token);
        console.log("从服务端获取到的token："+window.sessionStorage.getItem("access_token",e.data.access_token));
      });
    }
}

export default Auth
