import { request } from '@/network/request'

export function login (loginForm) {
  return request({
    method: 'post',
    url: 'login',
    data: loginForm
  })
}
