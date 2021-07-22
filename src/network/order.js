import { request } from './request'

//获取订单列表
export function _getOrderList (params) {
  return request({
    url: 'orders',
    params
  })
}

//物流进度
export function _getProgress () {
  return request({
    url: '/kuaidi/1106975712662'
  })
}


