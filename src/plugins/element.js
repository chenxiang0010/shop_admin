import Vue from 'vue'
import Element, { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Element)
