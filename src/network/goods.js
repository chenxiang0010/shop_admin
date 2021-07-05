import { request } from '@/network/request'

//获取商品列表
export function _getGoods (params) {
  return request({
    url: 'goods',
    params
  })
}

//根据id删除商品
export function _delGoods (id) {
  return request({
    method: 'delete',
    url: `goods/` + id
  })
}

//添加商品
export function _addGoods (data) {
  return request({
    method:'post',
    url:'goods',
    data
  })
}



