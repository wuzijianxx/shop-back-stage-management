import Vue from 'vue'
import {
    Button, Form, input, FormItem, Message, Container, Header, Aside, Main,
    Menu,Submenu,MenuItemGroup,MenuItem,Breadcrumb,BreadcrumbItem,Card,Row,
    Col,Table,TableColumn,Switch,Pagination,Tooltip,Dialog,MessageBox,Tag,
    Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(input)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm