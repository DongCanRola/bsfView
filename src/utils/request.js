import fetch from 'dva/fetch';
import $ from 'jquery'

function parseJSON(response) {
  return response.json();
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

/*
 headers.append("Access-Control-Allow-Origin","*")
 headers.append('mode','no-cors')
 */

const myEncode=(param,key)=>{
  let paramStr = "";
  if (typeof(param)=="string" || typeof(param)=="number" || typeof(param)=="boolean") {
    paramStr += "&" + key + "=" + encodeURIComponent(param).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
  } else {
    $.each(param, function(i) {
      var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
      paramStr += '&' + myEncode(this, k);
    });
  }
  return paramStr.substr(1);
}

export default {
  get : (url,header) => {
    const options = {
      method: "GET",
      headers: header
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => ({data}))
      .catch(err=>({err}));
  },
  put : (url,headers,body) => {
    const options = {
      method: "PUT",
      body:JSON.stringify(body),
      headers: headers
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => ({data}))
      .catch(err=>({err}));
  },
  delete : (url,headers,body) => {
    const options = {
      method: "DELETE",
      headers: headers
    }
    return fetch(url, options,body)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => ({data}))
      .catch(err=>({err}));
  },
  GET : (url) => {
    const options = {
      method: "GET",
      mode:'no-cors',
      dataType: 'JSONP',
      credentials: 'include',
      headers: headers,

    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => ({data}))
      .catch(err=>({err}));
  },
  post : (url, header,body) => {
    const options = {
      method: "POST",
      headers: header,
      body: JSON.stringify(body)
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => ({data}))
      .catch(err => ({err}));
  },

  POST:(url,body) => {
    const options = {
      method: "POST",
      headers: headers,
      mode:'no-cors',
      dataType: 'JSONP',
      credentials: 'include',
      //body: myEncode(body)
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => ({data}))
      .catch(err => ({err}));
  }
}
