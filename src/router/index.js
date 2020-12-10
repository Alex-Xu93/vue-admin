import Vue from 'vue'
import VueRouter from 'vue-router'

// 导入子路由
import Login from '../components/login/Login.vue'
import Home from '../components/home/Home.vue'
import Users from '../components/users/Users.vue'
import Welecom from '../components/welcom/Welcome.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  // 路由规则

  // 当打开页面时, '/'的hash路径, 重定向到登录页
  {
    path: '/',
    redirect: '/login'
  },

  // 3. 登录组件/页规则
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  // 4. home组件/页规则, 打开home页, 跳转到welcome页/组件
  {
    path: '/home',
    redirect: '/welcom',
    name: 'home',
    component: Home,
    // 在home组件内部注册子组件
    children: [
      // 欢迎子组件
      {
        path: '/welcom',
        name: 'welcom',
        component: Welecom
      },

      // 用户子组件
      {
        path: '/users',
        name: 'users',
        component: Users
      },

      // 权限子组件
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      },

      // 角色子组件
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      }

    ]
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
  if (sessionStorage.getItem('token')) {
    next()
  } else {
    // 去登录页面
    next('/login')
  }
})

export default router
