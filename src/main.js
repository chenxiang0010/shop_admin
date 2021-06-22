import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.defaults.baseURL = 'http://test.qhhz.xyz:8888/api/private/v1/'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
