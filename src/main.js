import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import store from './store'
import echarts from 'echarts'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

//document.onkeydown = function () {
//  let e = window.$el || arguments[0]
//  if (e.keyCode == 123) {
//    alert('剽窃源码可耻')
//    return false
//  }
//}
//
//document.oncontextmenu = function () {
//  alert('右键被禁用')
//  return false
//}

