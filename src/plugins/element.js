import Vue from 'vue'

// 从element-ui中导入组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 在全局对象Vue的原型中添加$message的方法
Vue.prototype.$message = Message
