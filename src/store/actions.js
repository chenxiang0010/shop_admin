import { _login } from '@/network/login'

export default {
  Login ({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit('auth_request')//登录前验证
      _login(params).then(res => {
        const SToken = res.data.token
        //window.sessionStorage.setItem('token', token)
        commit('auth_success', SToken)//更新token
        resolve(res)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  LogOut ({ commit }) {
    commit('logout')
  }
}
