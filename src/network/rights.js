import { request } from './request'

//获取权限列表
export function _getRightsList () {
  return request({
    url: 'rights/list'
  })
}
