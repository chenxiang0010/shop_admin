import { request } from './request'

export function menuList () {
  return request({
    url: 'menus'
  })
}
