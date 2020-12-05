import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入子路由
import Login from '../components/login/Login.vue'
import Home from '../components/home/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 路由规则

  // 当打开页面时, '/'的hash路径, 重定向到登录页
  {
    path: '/',
    redirect: 'login'
  },

  // 2. 登录组件/页规则
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  // 3. home组件/页规则
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  // 挂载路由
  routes
})

// 给路由对象添加导航守卫, 然后导出
router.beforeEach((to, from, next) => {
  // 如果用户请求的是登录页, 直接放行;
  if (to.name === 'login') {
    next()
  }

  // 如果用于请求的是其它页面, 判断sessionStorge中有没有token, 如果有, 放行, 如果没有, 去登录
  if (sessionStorage.getItem('token').length >= 0) {
    next()
  } else {
    // 去登录页面
    next('/login')
  }
})

export default router
