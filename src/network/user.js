import { request } from './request'

//获取用户列表
export function _getUserList (params) {
  return request({
    url: 'users',
    params
  })
}

//修改用户状态
export function _modifyUserState (userInfo) {
  return request({
    method: 'put',
    url: `users/${userInfo.id}/state/${userInfo.mg_state}`
  })
}

//添加用户
export function _addUser (addForm) {
  return request({
    method: 'post',
    url: 'users',
    data: addForm
  })

}

//根据id获取用户信息
export function _getUserInfo (id) {
  return request({
    url: `users/` + id
  })
}

//修改用户信息
export function _modifyUserInfo (id, data) {
  return request({
    method: 'put',
    url: `users/` + id,
    data
  })
}

//根据id删除用户
export function _delUser (id) {
  return request({
    method: 'delete',
    url: 'users/' + id
  })
}

//获取用户角色
export function _getUserRole () {
  return request({
    url: 'roles'
  })
}

//分配角色
export function _setUserRole (id, data) {
  return request({
    method: 'put',
    url: `users/${id}/role`,
    data
  })
}
