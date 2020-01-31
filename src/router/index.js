import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/login.vue')
// import Login from './components/login.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/home.vue')
// import Home from './components/home.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/welcome.vue')
// import Welcome from './components/welcome.vue'
const Users = () => import(/* webpackChunkName:"Users" */ '../components/Users/users.vue')
// import Users from './components/Users/users.vue'
const Rights = () => import(/* webpackChunkName:"power" */ '../components/power/rights.vue')
// import Rights from './components/power/rights.vue'
const Roles = () => import(/* webpackChunkName:"power" */ '../components/power/roles.vue')
// import Roles from './components/power/roles.vue'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/cate.vue')
// import Cate from './components/goods/cate.vue'
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/params.vue')
// import Params from './components/goods/params.vue'
const List = () => import(/* webpackChunkName:"goods" */ '../components/goods/list.vue')
// import List from './components/goods/list.vue'
const Add = () => import(/* webpackChunkName:"goods" */ '../components/goods/add.vue')
// import Add from './components/goods/add.vue'
const Order = () => import(/* webpackChunkName:"order" */ '../components/order/order.vue')
// import Order from './components/order/order.vue'
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/report.vue')
// import Report from './components/report/report.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, 
    {
      path: '/users',
      component: Users
    }, 
    {
      path: '/roles',
      component: Roles
    }, 
    {
      path: '/rights',
      component: Rights
    }, 
    {
      path: '/categories',
      component: Cate
    }, 
    {
      path: '/params',
      component: Params
    }, 
    {
      path: '/goods',
      component: List
    }, 
    {
      path: '/goods/add',
      component: Add
    }, 
    {
      path: '/orders',
      component: Order
    }, 
    {
      path: '/reports',
      component: Report
    }
  ]
  }
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  } else {
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) {
      return next('/login')
    }
  }
  next()
})


export default router