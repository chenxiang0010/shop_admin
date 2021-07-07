import moment from 'moment'
import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'
import TreeTable from 'vue-table-with-tree-grid'
import App from './App.vue'
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

