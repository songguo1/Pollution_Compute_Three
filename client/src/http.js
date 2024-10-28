import axios from "axios";
import { Message, Loading } from "element-ui";
import router from './router/index'

let loadingInstance
function startLoading() {
  loadingInstance = Loading.service({
    lock: true,
    text: "拼命加载中",
    background: "rgba(0,0,0,0.7)",
  });
}

function enloading() {
  if(loadingInstance)
  loadingInstance.close();
}

//请求拦截
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    //加载动画
    startLoading();

    if(localStorage.mytoken){
      //设置统一的请求header
      config.headers.Authorization=localStorage.mytoken
    }

    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
//响应拦截
axios.interceptors.response.use(
    function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    enloading()
    return response;
  }, 
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    enloading()
    console.log(error)
    if (error.response) {
      Message.error(error.response.data);
    } else {
      // 如果 error.response 不存在，可能是因为请求未能成功发送
      Message.error('请求失败，请稍后再试');
    }

    //获取错误状态码
    const {status}=error.response
    if(status==401){
      Message.error('token失效,请重新登录')
      //清除token
      localStorage.removeItem('mytoken')
      //跳转到登录页面
      router.push('/login')
    }
    return Promise.reject(error);
  });

export default axios;
