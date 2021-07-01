import { request } from '@/network/request'

//获取分类列表
export function _getCategoryList (params) {
  return request({
    url: 'categories',
    params
  })
}

//获取分类信息
export function _getCateInfo (params) {
  return request({
    url: 'categories',
    params
  })
}

//添加分类
export function _addCate (data) {
  return request({
    method: 'post',
    url: `categories`,
    data
  })
}

//获取需要修改商品分类信息
export function _getModifyCateInfo (id) {
  return request({
    url: `categories/` + id
  })
}

//修改分类
export function _modifyCate (id, data) {
  return request({
    method: 'put',
    url: `categories/` + id,
    data
  })
}

//删除分类
export function _deleteCate (id) {
  return request({
    method: 'delete',
    url: `categories/` + id
  })
}




