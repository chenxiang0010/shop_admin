import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/Login')
const Home = () => import('@/components/Home')
const Welcome = () => import('@/components/Welcome')
const Users = () => import('@/views/user/Users')
const Roles = () => import('@/views/rights/Roles')
const Rights = () => import('@/views/rights/Rights')
const Goods = () => import('@/views/commodity/Goods')
const AddGoods = () => import('@/views/commodity/AddGoods')
const Params = () => import('@/views/commodity/Params')
const Categories = () => import('@/views/commodity/Categories')
const Orders = () => import('@/views/order/Orders')
const Reports = () => import('@/views/report/Reports')

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/goods/addgoods', component: AddGoods },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
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
