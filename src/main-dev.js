import moment from 'moment'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import TreeTable from 'vue-table-with-tree-grid'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.prototype.$moment = moment
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  moment,
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

