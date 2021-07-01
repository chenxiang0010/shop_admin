import { request } from '@/network/request'

export function menuList () {
  return request({
    url: 'menus'
  })
}
