import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  status: '',
  token: ''
}

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      state
    })],
  mutations,
  actions,
  getters
})
