import axios from 'axios'

export function request (config) {
  //创建实例
  const instance = axios.create({
    baseURL: 'http://test.qhhz.xyz:8888/api/private/v1/'
  })

  //请求拦截器
  instance.interceptors.request.use(success => {
    success.headers.Authorization = window.sessionStorage.getItem('token')
    return success
  })

  instance.interceptors.response.use(res => {
    return res.data
  })
  //发送请求
  return instance(config)
}
