import { request } from './request'

//获取角色列表
export function _getRoleList () {
  return request({
    url: 'roles'
  })
}

//添加角色
export function _addRole (addRoleForm) {
  return request({
    method: 'post',
    url: 'roles',
    data: addRoleForm
  })
}

//根据id查询角色
export function _getRoleInfo (id) {
  return request({
    url: `roles/` + id
  })
}

//修改角色信息
export function _modifyRoleInfo (id, data) {
  return request({
    method: 'put',
    url: `roles/` + id,
    data
  })
}

//根据id删除角色
export function _delRole (id) {
  return request({
    method: 'delete',
    url: 'roles/' + id
  })
}

//获取用户权限
export function _getUserRight () {
  return request({
    url: 'rights/tree'
  })
}

//分配权限
export function _setUserRight (id, data) {
  return request({
    method: 'post',
    url: `roles/${id}/rights`,
    data
  })
}

//删除权限
export function _delRight (roleId, rightId) {
  return request({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}
