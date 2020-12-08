import Vue from 'vue'

// 从element-ui中导入组件
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Row, Col, Menu, Submenu, MenuItem, MenuItemGroup, MessageBox, Breadcrumb, BreadcrumbItem, Card, Table, TableColumn, Pagination, Switch, Tooltip, Dialog, Tag } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Row)
Vue.use(Col)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tag)

// 在全局对象Vue的原型中添加$message的方法
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
