import { request } from '@/network/request'

export function _login (loginForm) {
  return request({
    method: 'post',
    url: 'login',
    data: loginForm
  })
}
