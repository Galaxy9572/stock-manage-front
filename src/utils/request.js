import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Notification } from 'element-ui';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      if (res.code === 400) {
        Notification({
          title: '参数错误',
          message: res.message,
          type: 'error',
          duration: 3000
        })
      }
      if (res.code === 403) {
        Notification({
          title: '权限错误',
          message: res.message,
          type: 'error',
          duration: 3000
        })
      }
      if (res.code === 417) {
        Notification({
          title: '业务错误',
          message: res.message,
          type: 'error',
          duration: 3000
        })
      }
      if (res.code === 500) {
        Notification({
          title: '服务器错误',
          message: '服务器内部错误',
          type: 'error',
          duration: 3000
        })
      }
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('你当前未登录, 是否前往登录？', '用户未登录', {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Notification({
      title: '错误',
      message: error.message,
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

export default service
