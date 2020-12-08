import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式
import './assets/css/global.css'
// 引入字体图标库css
import './assets/fonts/iconfont.css'

// 引入axios, 用于请求接口
import axios from 'axios'

// 配置axios拦截器配置token
axios.interceptors.request.use(config => {
  // 为请求头, 添加Token验证的authorization属性;
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

// 配置接口基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 在全局对象Vue的原型上添加方法, 可以直接请求接口
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
