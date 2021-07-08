import index from '@/store/index'
import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Login')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '@/components/Welcome')

const Users = () => import(/* webpackChunkName: "User" */ '@/views/user/Users')

const Roles = () => import(/* webpackChunkName: "Roles_Rights" */ '@/views/rights/Roles')
const Rights = () => import(/* webpackChunkName: "Roles_Rights" */ '@/views/rights/Rights')

const Goods = () => import(/* webpackChunkName: "Goods_AddGoods_Params_Categories" */ '@/views/commodity/Goods')
const AddGoods = () => import(/* webpackChunkName: "Goods_AddGoods_Params_Categories" */ '@/views/commodity/AddGoods')
const Params = () => import(/* webpackChunkName: "Goods_AddGoods_Params_Categories" */ '@/views/commodity/Params')
const Categories = () => import(/* webpackChunkName: "Goods_AddGoods_Params_Categories" */ '@/views/commodity/Categories')

const Orders = () => import(/* webpackChunkName: "Orders" */ '@/views/order/Orders')

const Reports = () => import(/* webpackChunkName: "Report" */ '@/views/report/Reports')

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
  const tokenStr = index.state.token
  if (to.path === '/login') return next()
  if (!tokenStr) return next('/login')
  next()
})

export default router
