import {request} from './request'

export function _login (loginForm) {
  return request({
    method: 'post',
    url: 'login',
    data: loginForm
  })
}
