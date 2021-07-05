import { request } from '@/network/request'

//获取参数
export function _getParams (id, params) {
  return request({
    url: `categories/${id}/attributes`,
    params
  })
}

//添加属性
export function _addValue (id, data) {
  return request({
    method: 'post',
    url: `categories/${id}/attributes`,
    data
  })
}

//修改之前获取属性参数
export function _getValue (cid, aid, params) {
  return request({
    url: `categories/${cid}/attributes/${aid}`,
    params
  })
}

//修改属性
export function _modifyValue (cid, aid, data) {
  return request({
    method: 'put',
    url: `categories/${cid}/attributes/${aid}`,
    data
  })
}

//根据id删除参数
export function _delParams (cid, aid) {
  return request({
    method: 'delete',
    url: `categories/${cid}/attributes/${aid}`
  })
}

