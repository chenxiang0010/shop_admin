import { request } from '@/network/request'

//获取商品列表
export function _getGoods (params) {
  return request({
    url: 'goods',
    params
  })
}

//根据id查询商品信息
export function _getGoodsInfo (id) {
  return request({
    url: `goods/` + id
  })
}

//编辑商品信息
export function _modifyGoods (id, data) {
  return request({
    method: 'put',
    url: `goods/` + id,
    data
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
    method: 'post',
    url: 'goods',
    data
  })
}



