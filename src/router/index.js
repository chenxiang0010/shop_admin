import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')
  if (to.path === '/login') return next()
  if (!tokenStr) return next('/login')
  next()
})

// 解决上面跳转加参数报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

// 修改路由replace方法,阻止重复点击报错
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}

export default router
