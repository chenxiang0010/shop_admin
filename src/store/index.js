import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'
import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  status: '',
  token: ''
}

export default new Vuex.Store({
  plugins: [createPersistedState({
    state
  })],
  mutations,
  actions,
  getters
})
