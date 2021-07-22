import index from '@/store/index'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/home' },
  { path: '/login', component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Login') },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Welcome')
      },
      { path: '/users', component: () => import(/* webpackChunkName: "User" */ '@/views/user/Users') },
      { path: '/roles', component: () => import(/* webpackChunkName: "Roles_Rights" */ '@/views/rights/Roles') },
      { path: '/rights', component: () => import(/* webpackChunkName: "Roles_Rights" */ '@/views/rights/Rights') },
      {
        path: '/goods',
        component: () => import(/* webpackChunkName: "Goods_AddGoods_Params_Categories" */ '@/views/commodity/Goods')
      },
      {
        path: '/goods/addgoods',
        component: () => import(/* webpackChunkName: "Goods_AddGoods_Params_Categories" */ '@/views/commodity/AddGoods')
      },
      {
        path: '/params',
        component: () => import(/* webpackChunkName: "Goods_AddGoods_Params_Categories" */ '@/views/commodity/Params')
      },
      {
        path: '/categories',
        component: () => import(/* webpackChunkName: "Goods_AddGoods_Params_Categories" */ '@/views/commodity/Categories')
      },
      { path: '/orders', component: () => import(/* webpackChunkName: "Orders" */ '@/views/order/Orders') },
      { path: '/reports', component: () => import(/* webpackChunkName: "Report" */ '@/views/report/Reports') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const tokenStr = index.state.token
  if (!tokenStr) {
    if (to.path === '/login') return next()
    return next('/login')
  } else {
    if (to.path === '/login') {
      alert('你已经登录，请不要重复登录！')
      return next('/home')
    }
    next()
  }
})

export default router
