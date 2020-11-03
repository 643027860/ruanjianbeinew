import axios from 'axios'
import qs from 'qs'

export default function ajax (url, data={}, type='GET',json=false) {
  return new Promise(function (resolve, reject) {
    //为了兼容IE消除请求缓存，所以需要加入时间戳
    const time = new Date().getTime()
    //url = url + '?'+ time

    // 设置请求头为 Authorization信息
    var Authorization = ''
    //获取已经登录的用户信息
    var user = JSON.parse(localStorage.getItem('RUANJIANBEI_USER'))
    if(user){
      user = user.user
      Authorization = user.jwt.token_type + ' ' + user.jwt.access_token
    }
    var headers = {Authorization}
    // 执行异步ajax请求
    let promise
    if (type === 'GET') {
      //准备url query参数数据
      if(data!=={}){
        let dataStr = '' //数据拼接字符串
        Object.keys(data).forEach(key => {
          dataStr += key + '=' + data[key] + '&'
        })
        if (dataStr !== '') {
          dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
          url = url + '?' + dataStr
        }
      }
      // 发送get请求
      promise = axios.get(url,{
        headers
      })
    } else if(type === 'POST'){
      // 发送post请求
      if(json)
        promise = axios.post(url, qs.stringify(data),{
          headers
        })
      else{
        promise = axios.post(url, data,{
          headers
        })
      }
    }else if(type === 'PUT'){
      // 发送put请求
      if(json)
        promise = axios.put(url, qs.stringify(data),{
          headers
        })
      else
        promise = axios.put(url, data,{
          headers
        })
    }else if(type === 'DELETE'){
      // delete,如果服务端将参数当做 java对象来封装接收则 参数格式为：{data: param}
      //如果服务端将参数当做url 参数 接收，则格式为：{params: param}，这样发送的url将变为http:www.XXX.com?a=..&b=..
      //promise = axios.delete(url, {data})
      promise = axios.delete(url, {headers})
    }
    promise.then(function (response) {
      // 成功了调用resolve()
      resolve(response.data)
    }).catch(function (error) {
      //reject(error)
      resolve(error)
    })
  })
}
