import { request } from '@/network/request'

export function _getReport () {
  return request({
    url: 'reports/type/1'
  })
}

