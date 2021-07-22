import { request } from './request'

export function _getReport () {
  return request({
    url: 'reports/type/1'
  })
}

