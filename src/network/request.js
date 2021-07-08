import index from '@/store/index'
import axios from 'axios'
import NProgress from 'nprogress'

export function request (config) {
  //创建实例
  const instance = axios.create({
    baseURL: 'http://test.qhhz.xyz:8888/api/private/v1/'
  })

  //请求拦截器
  instance.interceptors.request.use(success => {
    NProgress.start()
    success.headers.Authorization = index.state.token
    return success
  })

  instance.interceptors.response.use(res => {
    NProgress.done()
    return res.data
  })
  //发送请求
  return instance(config)
}
